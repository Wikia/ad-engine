import { context, utils } from '@wikia/ad-engine';

const trackingOptInLibraryUrl =
	'//origin-images.wikia.com/fandom-ae-assets/tracking-opt-in/v3.0.6/tracking-opt-in.min.js';
const logGroup = 'tracking-opt-in-wrapper';

/**
 * Wraps all functionality for the consent management system
 */
class TrackingOptInWrapper {
	private libraryReady = false;
	private consentInstances: any;

	private gdprConsent = false;
	private geoRequiresConsent = true;

	private ccpaSignal = false;
	private geoRequiresSignal = true;

	constructor() {
		window.ads = window.ads || ({} as MediaWikiAds);
		window.ads.consentQueue = new utils.LazyQueue<(callback: any) => void>(
			...(window.ads.consentQueue || []),
		);
		window.ads.pushToConsentQueue =
			window.ads.pushToConsentQueue ||
			((callback) => {
				window.ads.consentQueue.push(callback);
			});
	}

	async init(): Promise<void> {
		const initPromise = this.initInstances();

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

	private initInstances(): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			await utils.scriptLoader.loadScript(trackingOptInLibraryUrl);

			this.libraryReady = true;

			const disableConsentQueue = !!context.get('options.disableConsentQueue');

			utils.logger(logGroup, 'Modal library loaded');

			this.consentInstances = window.trackingOptIn.default({
				disableConsentQueue,
				enableCCPAinit: true,
				isSubjectToCcpa: window.ads.context && window.ads.context.opts.isSubjectToCcpa,
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

	installConsentQueue(): void {
		window.ads.consentQueue.onItemFlush((callback) => {
			callback({
				gdprConsent: this.gdprConsent,
				geoRequiresConsent: this.geoRequiresConsent,
				ccpaSignal: this.ccpaSignal,
				geoRequiresSignal: this.geoRequiresSignal,
				gdprInstance: this.consentInstances.gdpr,
				ccpaInstance: this.consentInstances.ccpa,
			});
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

	flushConsentQueue(): void {
		context.set('options.trackingOptIn', this.gdprConsent);
		context.set('options.optOutSale', this.ccpaSignal);
		context.set('options.geoRequiresConsent', this.geoRequiresConsent);
		context.set('options.geoRequiresSignal', this.geoRequiresSignal);

		window.ads.consentQueue.flush();
	}
}

export const trackingOptInWrapper = new TrackingOptInWrapper();
