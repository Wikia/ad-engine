import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, tcf, usp } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader } from '@ad-engine/utils';

const logGroup = 'ATS';

export class Ats extends BaseServiceSetup {
	private isLoaded = false;
	private launchpadScriptUrl =
		'https://launchpad-wrapper.privacymanager.io/2f928425-1fbe-4680-b67a-c5f5ad831378/launchpad-liveramp.js';
	private launchpadBundleScriptUrl =
		'https://launchpad.privacymanager.io/latest/launchpad.bundle.js';

	call(): Promise<void> {
		if (!this.isEnabled('bidders.liveRampATS.enabled')) {
			logger(logGroup, 'disabled');
			return;
		}

		logger(logGroup, 'enabled');
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'ats_start',
		});

		if (this.isLoaded) {
			logger(logGroup, 'not loaded');
			return;
		}

		const userEmailHashes: [string, string, string] = context.get('wiki.opts.userEmailHashes');
		if (!Array.isArray(userEmailHashes) || userEmailHashes?.length !== 3) {
			logger(logGroup, 'no hashes');
			return;
		}

		const [md5, sha1, sha256] = userEmailHashes;
		const launchpadScript = scriptLoader.loadScript(this.launchpadScriptUrl);
		const launchpadBundleScript = scriptLoader.loadScript(this.launchpadBundleScriptUrl);

		return Promise.all([launchpadScript, launchpadBundleScript]).then(async () => {
			const consentType = context.get('options.geoRequiresConsent') ? 'gdpr' : 'ccpa';
			const consentString =
				consentType === 'gdpr'
					? (await tcf.getTCData()).tcString
					: (await usp.getSignalData()).uspString;

			window.ats.setAdditionalData({
				consentType,
				consentString,
				type: 'emailHashes',
				id: [sha1, sha256, md5],
			});

			logger(logGroup, 'additional data set');

			this.isLoaded = true;
			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'ats_done',
			});
		});
	}
}
