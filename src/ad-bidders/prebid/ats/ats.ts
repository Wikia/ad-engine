import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import Cookies from 'js-cookie';

const logGroup = 'ATS';

export class Ats extends BaseServiceSetup {
	private isLoaded = false;
	private atsScriptUrl =
		'https://ats-wrapper.privacymanager.io/ats-modules/2be88350-78eb-4214-96b8-3a489d2aa7d6/ats.js';

	call(): Promise<void> {
		if (!this.isEnabled('bidders.liveRampATS.enabled')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			const userEmailHashes: [string, string, string] = context.get('wiki.opts.userEmailHashes');
			const atsScript = utils.scriptLoader.loadScript(this.atsScriptUrl);

			if (!Array.isArray(userEmailHashes) || userEmailHashes?.length !== 3) {
				return Promise.resolve();
			}

			const [md5, sha1, sha256] = userEmailHashes;

			return atsScript.then(() => {
				const consentType = context.get('options.geoRequiresConsent') ? 'gdpr' : 'ccpa';
				const consentString =
					consentType === 'gdpr' ? Cookies.get('euconsent-v2') : Cookies.get('usprivacy');
				(window as any).ats.setAdditionalData({
					consentType,
					consentString,
					type: 'emailHashes',
					id: [sha1, sha256, md5],
				});

				utils.logger(logGroup, 'additional data set');

				this.isLoaded = true;
			});
		}
	}
}
