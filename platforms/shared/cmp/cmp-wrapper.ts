import { context, utils } from '@wikia/ad-engine';

const trackingOptInLibraryUrl = '//origin-images.wikia.com/fandom-ae-assets/tracking-opt-in/v2.0.6/tracking-opt-in.min.js';
const optOutConsentString = 'BOl8T5MOl8T5MCNACAENCiAAAAAp6A';
const logGroup = 'cmp-wrapper';

/**
 * Wraps all functionality for the consent management system
 */
class CmpWrapper {
	cmpReady = false;
	cmpModal: any;
	cmpStored: WindowCMP = null;
	gdprConsent = false;

	/**
	 * Initialize the CMP system
	 * Returns a Promise fulfilled when the CMP library is ready for use
	 */
	init(country: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			// In case it fails to load, we'll resolve after 2s
			setTimeout(() => {
				utils.logger(logGroup, 'Timeout waiting for CMP to load');
				resolve();
			}, 2000);

			utils.scriptLoader.loadScript(trackingOptInLibraryUrl).then(() => {
				utils.logger(logGroup, 'Modal library loaded');

				this.cmpReady = true;
				this.cmpModal = window.trackingOptIn.default({
					country,
					onAcceptTracking: () => {
						utils.logger(logGroup, 'GDPR Consent');
						this.gdprConsent = true;
						this.restoreCmp();
					},
					onRejectTracking: () => {
						utils.logger(logGroup, 'GDPR Non-consent');
						this.gdprConsent = false;
						this.restoreCmp();
					},
					zIndex: 9999999,
				});

				const consentRequired = this.cmpModal.geoRequiresTrackingConsent();

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
			if (!this.cmpModal.geoRequiresTrackingConsent()) {
				this.gdprConsent = true;
				resolve(true);
				return;
			}

			if (this.cmpModal.hasUserConsented() === undefined) {
				this.overwriteCmp();
				resolve(false);
				return;
			}

			this.gdprConsent = this.cmpModal.hasUserConsented();
			utils.logger(logGroup, `User consent: ${this.gdprConsent}`);

			resolve(this.gdprConsent);
			return;
		});
	}

	/**
	 * Restore original CMP version
	 */
	private restoreCmp(): void {
		if (this.cmpStored) {
			utils.logger(logGroup, 'Restoring original CMP module');
			window.__cmp = this.cmpStored;
		}
	}

	/**
	 * Store and replace original CMP with temporary opting-out version
	 */
	private overwriteCmp(): void {
		utils.logger(logGroup, 'Overwriting original CMP module');
		this.cmpStored = window.__cmp;

		// @ts-ignore
		window.__cmp = (method: string, data: any, callback: any) => {
			const consentData = {
				gdprApplies: true,
				hasGlobalScope: false,
			};

			if (method === 'getConsentData') {
				consentData['consentData'] = optOutConsentString;
			} else if (method === 'getVendorConsents') {
				consentData['cmpId'] = 141;
				consentData['cmpVersion'] = 2;
				consentData['consentLanguage'] = 'en';
				consentData['consentScreen'] = 0;
				consentData['cookieVersion'] = 1;
				consentData['created'] = new Date().toJSON();
				consentData['globalVendorListVersion'] = undefined;
				consentData['lastUpdated'] = new Date().toJSON();
				consentData['maxVendorId'] = 670;
				consentData['metadata'] = optOutConsentString;
				consentData['publisherVendorsVersion'] = undefined;
				consentData['purposeConsents'] = {};
				consentData['vendorConsents'] = {};
				consentData['vendorListVersion'] = 162;
			} else {
				return;
			}

			callback(consentData);
		};
		window.__cmp.receiveMessage = this.cmpStored.receiveMessage;
	}
}

export const cmpWrapper = new CmpWrapper();
