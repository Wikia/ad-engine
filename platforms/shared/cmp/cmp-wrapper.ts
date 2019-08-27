import { utils } from '@wikia/ad-engine';
import * as Cookies from 'js-cookie';

const CMP_LIBRARY_URL = '//cdm.cursecdn.com/js/cmp/tracking-opt-in.min.js';
const optOutConsentString = 'BOl8T5MOl8T5MCNACAENCiAAAAAp6A';
const logGroup = 'cmp-wrapper';

/**
 * Constants for controlling the display of the CMP modal/banner
 */
export enum CmpPolicy {
	always,
	never,
	detect,
}

/**
 * Wraps all functionality for the consent management system
 */
class CmpWrapper {
	cmpReady = false;
	cmpModal: any;
	gdprConsent = false;
	gdprConsentPolicy: CmpPolicy = CmpPolicy.detect;

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

			utils.scriptLoader.loadScript(CMP_LIBRARY_URL).then(() => {
				utils.logger(logGroup, 'CMP Loaded');

				this.cmpReady = true;
				this.cmpModal = window.trackingOptIn.default({
					country,
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

				resolve();
			});
		});
	}

	/**
	 * Returns a promise fulfilled when either the geo does not require consent, CMP is disabled,
	 * or the geo requires consent that has either been previously set in a cookie or via interaction
	 * with the CMP UI.
	 *
	 * @param geo The geo to check for GDPR consent
	 */
	getConsent(geo: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			// Nothing is needed if cookies are disabled
			if (!window.navigator.cookieEnabled) {
				utils.logger(logGroup, 'Cookies are disabled. Ignoring CMP consent check');
				resolve(true);
				return;
			}

			// Nothing is needed if the geo does not require consent
			if (!this.geoRequiresConsent(geo)) {
				this.gdprConsent = true;
				resolve(true);
				return;
			}

			if (!Cookies.get('euconsent')) {
				utils.logger(logGroup, 'No consent data found. Showing consent tool');
				window.__cmp('showConsentTool');

				this.overwriteCmp();

				resolve(false);
				return;
			}

			if (!this.cmpReady) {
				resolve(false);
				return;
			}

			// Populate hidden div read by Prebid
			window.__cmp('getConsentData', null, (result: any) => {
				utils.logger(logGroup, 'Populating Prebid consent data');

				const body = document.getElementsByTagName('body')[0];
				const consentDataDiv = document.createElement('div');

				consentDataDiv.id = 'iab';
				consentDataDiv.innerText = JSON.stringify(result, null, 2);
				consentDataDiv.style['display'] = 'none';

				body.appendChild(consentDataDiv);
				utils.logger(logGroup, consentDataDiv.innerText);
			});

			const maxPurposes = 5;

			// Get fine-grained information about the consent details for calculation of a policy to send DFP
			window.__cmp('getVendorConsents', null, (result: any) => {
				const stringifiedResult = JSON.stringify(result, null, 2);
				utils.logger(logGroup, `getVendorConsents callback result:\n${stringifiedResult}`);

				// Should not happen
				if (!result || !result.purposeConsents) {
					this.gdprConsent = false;
					return;
				}

				// Consider global consent to be consenting to all purposes
				let consentFlag = true;

				for (let i = 0; i < maxPurposes; i++) {
					// Variable purposeConsents is not an array, but an object with properties named '1'-'5'
					if (!result.purposeConsents[String(i + 1)]) {
						consentFlag = false;
						break;
					}
				}

				this.gdprConsent = consentFlag;

				utils.logger(logGroup, `Consent from vendorConsent purposes ${this.gdprConsent}`);

				resolve(this.gdprConsent);
				return;
			});
		});
	}

	/**
	 * Store and replace original CMP with temporary opting-out version
	 */
	overwriteCmp(): void {
		let cmpStored: WindowCMP;

		window.__cmp('getConsentData', null, () => {
			utils.logger(logGroup, 'Restoring original CMP module');
			window.__cmp = cmpStored;
		});

		utils.logger(logGroup, 'Overwriting original CMP module');
		cmpStored = window.__cmp;
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
		window.__cmp.receiveMessage = cmpStored.receiveMessage;
	}

	/**
	 * Returns whether a given geo requires GDPR consent
	 *
	 * @param geo The geo to check for GDPR consent
	 */
	geoRequiresConsent(geo: string): boolean {
		const upperGeo = geo.toUpperCase();
		const euGeos: string[] = [
			'AT',
			'BE',
			'BG',
			'CY',
			'CZ',
			'DE',
			'DK',
			'EE',
			'ES',
			'FI',
			'FR',
			'GR',
			'HR',
			'HU',
			'IE',
			'IT',
			'LT',
			'LU',
			'LV',
			'MT',
			'NL',
			'PL',
			'PT',
			'RO',
			'SE',
			'SI',
			'SK',
			'GB', // for now
			'UK', // for now
		];
		const eeaGeos: string[] = ['CH', 'IS', 'LI', 'NO'];

		// Check debugging / feature flags
		if (this.gdprConsentPolicy === CmpPolicy.never) {
			utils.logger(logGroup, 'GDPR Consent disabled');
			this.gdprConsent = true;
			return false;
		}

		if (this.gdprConsentPolicy === CmpPolicy.always) {
			utils.logger(logGroup, 'GDPR Consent explicity required');
			return true;
		}

		const consentRequired =
			geo === 'undefined' || euGeos.indexOf(upperGeo) > -1 || eeaGeos.indexOf(upperGeo) > -1;

		if (consentRequired) {
			utils.logger(logGroup, `GDPR Consent required for ${geo}`);
			return true;
		}

		utils.logger(logGroup, `GDPR Consent not required`);
		this.gdprConsent = true;

		return false;
	}
}

export const cmpWrapper = new CmpWrapper();
