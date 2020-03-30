import { context, utils } from '@wikia/ad-engine';

const trackingOptInLibraryUrl =
	'//origin-images.wikia.com/fandom-ae-assets/tracking-opt-in/v3.0.3/tracking-opt-in.min.js';
const logGroup = 'tracking-opt-in-wrapper';

/**
 * Wraps all functionality for the consent management system
 */
class TrackingOptInWrapper {
	libraryReady = false;
	consentInstances: any;

	gdprConsent = false;
	geoRequiresConsent = true;

	ccpaSignal = false;
	geoRequiresSignal = true;

	constructor() {
		this.installConsentQueue();
	}

	private installConsentQueue(): void {
		window.ads = window.ads || ({} as MediaWikiAds);
		window.ads.consentQueue = new utils.LazyQueue<(callback: any) => void>(
			...(window.ads.consentQueue || []),
		);

		window.ads.consentQueue.onItemFlush((callback) => {
			callback({
				gdprConsent: this.gdprConsent,
				geoRequiresConsent: this.geoRequiresConsent,
				ccpaSignal: this.ccpaSignal,
				geoRequiresSignal: this.geoRequiresSignal,
			});
		});
		window.ads.pushToConsentQueue =
			window.ads.pushToConsentQueue ||
			((callback) => {
				window.ads.consentQueue.push(callback);
			});
	}

	flushConsentQueue(): void {
		context.set('options.trackingOptIn', this.gdprConsent);
		context.set('options.optOutSale', this.ccpaSignal);
		context.set('options.geoRequiresConsent', this.geoRequiresConsent);
		context.set('options.geoRequiresSignal', this.geoRequiresSignal);

		window.ads.consentQueue.flush();
	}

	async init(geoData: utils.GeoData): Promise<void> {
		const initPromise = this.initInstances(geoData);

		try {
			await Promise.race([initPromise, utils.timeoutReject(2000)]);
		} catch (e) {
			if (!this.libraryReady) {
				utils.logger(logGroup, 'Timeout waiting for library to load');
				return;
			}

			await initPromise;
		}
	}

	private initInstances(geoData: utils.GeoData): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			await utils.scriptLoader.loadScript(trackingOptInLibraryUrl);

			this.libraryReady = true;

			const country = geoData.country;
			const region = geoData.region;
			const disableConsentQueue = !!context.get('options.disableConsentQueue');

			utils.logger(logGroup, 'Modal library loaded');

			this.consentInstances = window.trackingOptIn.default({
				country,
				region,
				disableConsentQueue,
				enableCCPAinit: true,
				onAcceptTracking: () => {
					utils.logger(logGroup, 'GDPR Consent');
					resolve();
				},
				onRejectTracking: () => {
					utils.logger(logGroup, 'GDPR Non-consent');
					resolve();
				},
				zIndex: 9999999,
			});

			this.geoRequiresConsent = this.consentInstances.gdpr.geoRequiresTrackingConsent();
			this.geoRequiresSignal = this.consentInstances.ccpa.geoRequiresUserSignal();

			if (disableConsentQueue) {
				resolve();
			}
		});
	}

	getConsent(): void {
		// Nothing is needed if cookies are disabled
		if (!window.navigator.cookieEnabled) {
			utils.logger(logGroup, 'Cookies are disabled. Ignoring CMP consent check');
			this.gdprConsent = true;
			return;
		}

		if (!this.libraryReady) {
			this.gdprConsent = false;
			return;
		}

		// Nothing is needed if the geo does not require any consent
		if (!this.consentInstances.gdpr.geoRequiresTrackingConsent()) {
			this.gdprConsent = true;
			return;
		}

		if (this.consentInstances.gdpr.hasUserConsented() === undefined) {
			this.gdprConsent = false;
			return;
		}

		this.gdprConsent = this.consentInstances.gdpr.hasUserConsented();

		utils.logger(logGroup, `User consent: ${this.gdprConsent}`);
	}

	getSignal(): void {
		// Nothing is needed if cookies are disabled
		if (!window.navigator.cookieEnabled) {
			utils.logger(logGroup, 'Cookies are disabled. Ignoring USAPI consent check');
			this.ccpaSignal = false;
			return;
		}

		if (!this.libraryReady) {
			this.ccpaSignal = true;
			return;
		}

		// Nothing is needed if the geo does not require any consent
		if (!this.consentInstances.ccpa.geoRequiresUserSignal()) {
			this.ccpaSignal = false;
			return;
		}

		if (this.consentInstances.ccpa.hasUserProvidedSignal() === undefined) {
			this.ccpaSignal = true;
			return;
		}

		this.ccpaSignal = this.consentInstances.ccpa.hasUserProvidedSignal();

		utils.logger(logGroup, `User signal: ${this.ccpaSignal}`);
	}
}

export const trackingOptInWrapper = new TrackingOptInWrapper();
