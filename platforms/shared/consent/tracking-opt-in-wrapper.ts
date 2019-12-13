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
	ccpaSignal = false;
	gdprConsent = false;

	/**
	 * Initialize the system
	 * Returns a Promise fulfilled when the library is ready for use
	 */
	init(geoData: utils.GeoData): Promise<void> {
		const country = geoData.country;
		const region = geoData.region;

		return new Promise<void>((resolve, reject) => {
			// In case it fails to load, we'll resolve after 2s
			setTimeout(() => {
				utils.logger(logGroup, 'Timeout waiting for library to load');
				resolve();
			}, 2000);

			utils.scriptLoader.loadScript(trackingOptInLibraryUrl).then(() => {
				utils.logger(logGroup, 'Modal library loaded');

				this.libraryReady = true;
				this.consentInstances = window.trackingOptIn.default({
					country,
					region,
					disableConsentQueue: true,
					enableCCPAinit: true,
					onAcceptTracking: () => {
						utils.logger(logGroup, 'GDPR Consent');
						this.gdprConsent = true;
					},
					onRejectTracking: () => {
						utils.logger(logGroup, 'GDPR Non-consent');
						this.gdprConsent = false;
					},
					zIndex: 9999999,
				});

				context.set(
					'options.geoRequiresConsent',
					this.consentInstances.gdpr.geoRequiresTrackingConsent(),
				);
				context.set(
					'options.geoRequiresSignal',
					this.consentInstances.ccpa.geoRequiresUserSignal(),
				);

				resolve();
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
				context.set('options.trackingOptIn', true);
				resolve();
				return;
			}

			if (!this.libraryReady) {
				context.set('options.trackingOptIn', false);
				resolve();
				return;
			}

			// Nothing is needed if the geo does not require any consent
			if (!this.consentInstances.gdpr.geoRequiresTrackingConsent()) {
				this.gdprConsent = true;
				context.set('options.trackingOptIn', true);
				resolve();
				return;
			}

			if (this.consentInstances.gdpr.hasUserConsented() === undefined) {
				context.set('options.trackingOptIn', false);
				resolve();
				return;
			}

			this.gdprConsent = this.consentInstances.gdpr.hasUserConsented();

			utils.logger(logGroup, `User consent: ${this.gdprConsent}`);
			context.set('options.trackingOptIn', this.gdprConsent);

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
				context.set('options.optOutSale', false);
				resolve();
				return;
			}

			if (!this.libraryReady) {
				context.set('options.optOutSale', true);
				resolve();
				return;
			}

			// Nothing is needed if the geo does not require any consent
			if (!this.consentInstances.ccpa.geoRequiresUserSignal()) {
				this.ccpaSignal = false;
				context.set('options.optOutSale', false);
				resolve();
				return;
			}

			if (this.consentInstances.ccpa.hasUserProvidedSignal() === undefined) {
				context.set('options.optOutSale', true);
				resolve();
				return;
			}

			this.ccpaSignal = this.consentInstances.ccpa.hasUserProvidedSignal();

			utils.logger(logGroup, `User signal: ${this.ccpaSignal}`);
			context.set('options.optOutSale', this.ccpaSignal);

			resolve();
			return;
		});
	}
}

export const trackingOptInWrapper = new TrackingOptInWrapper();
