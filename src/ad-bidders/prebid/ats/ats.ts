import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import Cookies from 'js-cookie';

const logGroup = 'ATS';

export class Ats extends BaseServiceSetup {
	static PLACEMENT_ID = '2161';
	static ENVELOPE_STORAGE_NAME = 'idl_env';
	private isLoaded = false;
	private launchpadScriptUrl =
		'https://launchpad-wrapper.privacymanager.io/2f928425-1fbe-4680-b67a-c5f5ad831378/launchpad-liveramp.js';
	private launchpadBundleScriptUrl =
		'https://launchpad.privacymanager.io/latest/launchpad.bundle.js';

	call(): Promise<void> {
		if (!this.isEnabled('bidders.liveRampATS.enabled')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		if (this.isLoaded) {
			return;
		}

		const userEmailHashes: [string, string, string] = context.get('wiki.opts.userEmailHashes');
		if (!Array.isArray(userEmailHashes) || userEmailHashes?.length !== 3) {
			return;
		}
		const [md5, sha1, sha256] = userEmailHashes;
		const launchpadScript = utils.scriptLoader.loadScript(this.launchpadScriptUrl);
		const launchpadBundleScript = utils.scriptLoader.loadScript(this.launchpadBundleScriptUrl);

		return Promise.all([launchpadScript, launchpadBundleScript])
			.then(() => this.waitForAts())
			.then(() => {
				const consentType = context.get('options.geoRequiresConsent') ? 'gdpr' : 'ccpa';
				const consentString =
					consentType === 'gdpr' ? Cookies.get('euconsent-v2') : Cookies.get('usprivacy');

				window.ats.setAdditionalData({
					consentType,
					consentString,
					type: 'emailHashes',
					id: [sha1, sha256, md5],
				});

				utils.logger(logGroup, 'additional data set');

				this.isLoaded = true;
			});
	}

	private waitForAts(): Promise<boolean> {
		return new utils.WaitFor(() => window.ats !== undefined, 10, 50).until();
	}
}
