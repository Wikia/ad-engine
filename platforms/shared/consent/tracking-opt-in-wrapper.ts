import { context, utils } from '@wikia/ad-engine';

const trackingOptInLibraryUrl =
	'//origin-images.wikia.com/fandom-ae-assets/tracking-opt-in/v3.0.1/tracking-opt-in.min.js';
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

	installConsentQueue(): void {
		window.ads = window.ads || ({} as Ads);
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

	flushConsentQueue(): Promise<void> {
		context.set('options.trackingOptIn', this.gdprConsent);
		context.set('options.optOutSale', this.ccpaSignal);
		context.set('options.geoRequiresConsent', this.geoRequiresConsent);
		context.set('options.geoRequiresSignal', this.geoRequiresSignal);

		window.ads.consentQueue.flush();

		return Promise.resolve();
	}

	/**
	 * Initialize the system
	 * Returns a Promise fulfilled when the library is ready for use
	 */
	init(geoData: utils.GeoData): Promise<void> {
		const country = geoData.country;
		const region = geoData.region;

		return new Promise<void>((resolve, reject) => {
			// In case it fails to load, we'll resolve after 2s
			const loadingTimeout = setTimeout(() => {
				utils.logger(logGroup, 'Timeout waiting for library to load');
				resolve();
			}, 2000);

			const disableConsentQueue = !!context.get('options.disableConsentQueue');

			utils.scriptLoader.loadScript(trackingOptInLibraryUrl).then(() => {
				// Clear loading timeout
				clearTimeout(loadingTimeout);

				utils.logger(logGroup, 'Modal library loaded');

				this.libraryReady = true;
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
		});
	}

	/**
	 * Returns a promise fulfilled when either the geo does not require consent, CMP is disabled,
	 * or the geo requires consent that has either been previously set in a cookie or via interaction
	 * with the CMP UI
	 */
	getConsent(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			// Nothing is needed if cookies are disabled
			if (!window.navigator.cookieEnabled) {
				utils.logger(logGroup, 'Cookies are disabled. Ignoring CMP consent check');
				this.gdprConsent = true;
				resolve();
				return;
			}

			if (!this.libraryReady) {
				this.gdprConsent = false;
				resolve();
				return;
			}

			// Nothing is needed if the geo does not require any consent
			if (!this.consentInstances.gdpr.geoRequiresTrackingConsent()) {
				this.gdprConsent = true;
				resolve();
				return;
			}

			if (this.consentInstances.gdpr.hasUserConsented() === undefined) {
				this.gdprConsent = false;
				resolve();
				return;
			}

			this.gdprConsent = this.consentInstances.gdpr.hasUserConsented();

			utils.logger(logGroup, `User consent: ${this.gdprConsent}`);

			resolve();
			return;
		});
	}

	/**
	 * Returns a promise fulfilled when either the geo does not require signal, USAPI is disabled,
	 * or the geo requires signal that has either been previously set in a cookie or via interaction
	 * with the USAPI UI
	 */
	getSignal(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			// Nothing is needed if cookies are disabled
			if (!window.navigator.cookieEnabled) {
				utils.logger(logGroup, 'Cookies are disabled. Ignoring USAPI consent check');
				this.ccpaSignal = false;
				resolve();
				return;
			}

			if (!this.libraryReady) {
				this.ccpaSignal = true;
				resolve();
				return;
			}

			// Nothing is needed if the geo does not require any consent
			if (!this.consentInstances.ccpa.geoRequiresUserSignal()) {
				this.ccpaSignal = false;
				resolve();
				return;
			}

			if (this.consentInstances.ccpa.hasUserProvidedSignal() === undefined) {
				this.ccpaSignal = true;
				resolve();
				return;
			}

			this.ccpaSignal = this.consentInstances.ccpa.hasUserProvidedSignal();

			utils.logger(logGroup, `User signal: ${this.ccpaSignal}`);

			resolve();
			return;
		});
	}
}

export const trackingOptInWrapper = new TrackingOptInWrapper();
