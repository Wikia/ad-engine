import { context, utils } from '@wikia/ad-engine';

const trackingOptInLibraryUrl =
	'//origin-images.wikia.com/fandom-ae-assets/tracking-opt-in/v2.3.0/tracking-opt-in.min.js';
const logGroup = 'cmp-wrapper';

/**
 * Wraps all functionality for the consent management system
 */
class CmpWrapper {
	cmpReady = false;
	consentInstances: any;
	ccpaSignal = false;
	gdprConsent = false;

	/**
	 * Initialize the CMP system
	 * Returns a Promise fulfilled when the CMP library is ready for use
	 */
	init(geoData: utils.GeoData): Promise<void> {
		const country = geoData.country;
		const region = geoData.region;

		return new Promise<void>((resolve, reject) => {
			// In case it fails to load, we'll resolve after 2s
			setTimeout(() => {
				utils.logger(logGroup, 'Timeout waiting for CMP to load');
				resolve();
			}, 2000);

			utils.scriptLoader.loadScript(trackingOptInLibraryUrl).then(() => {
				utils.logger(logGroup, 'Modal library loaded');

				this.cmpReady = true;
				this.consentInstances = window.trackingOptIn.default({
					country,
					region,
					disableConsentQueue: true,
					enableCCPAinit: utils.queryString.get('icUSPrivacyApi') === '1',
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

				const consentRequired = this.consentInstances.gdpr.geoRequiresTrackingConsent();

				context.set('custom.isCMPEnabled', consentRequired);
				context.set('options.geoRequiresConsent', consentRequired);

				resolve();
			});
		});
	}

	/**
	 * Returns a promise fulfilled when either the geo does not require consent, CMP is disabled,
	 * or the geo requires consent that has either been previously set in a cookie or via interaction
	 * with the CMP UI.
	 */
	getConsent(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			// Nothing is needed if cookies are disabled
			if (!window.navigator.cookieEnabled) {
				utils.logger(logGroup, 'Cookies are disabled. Ignoring CMP consent check');
				resolve(true);
				return;
			}

			if (!this.cmpReady) {
				resolve(false);
				return;
			}

			// Nothing is needed if the geo does not require consent
			if (
				!this.consentInstances.gdpr.geoRequiresTrackingConsent() &&
				(!this.consentInstances.ccpa || !this.consentInstances.ccpa.geoRequiresUserSignal())
			) {
				this.gdprConsent = true;
				resolve(true);
				return;
			}

			if (
				this.consentInstances.gdpr.hasUserConsented() === undefined &&
				this.consentInstances.ccpa &&
				this.consentInstances.ccpa.hasUserProvidedSignal() === undefined
			) {
				resolve(false);
				return;
			}

			this.gdprConsent = this.consentInstances.gdpr.hasUserConsented();
			this.ccpaSignal =
				this.consentInstances.ccpa && this.consentInstances.ccpa.hasUserProvidedSignal();

			utils.logger(logGroup, `User consent: ${this.gdprConsent}`);
			utils.logger(logGroup, `User signal: ${this.ccpaSignal}`);

			resolve(this.gdprConsent && !this.ccpaSignal);
			return;
		});
	}
}

export const cmpWrapper = new CmpWrapper();
