import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'ATS';

export class Ats extends BaseServiceSetup {
	private isLoaded = false;
	private atsScriptSrc = 'https://ats.rlcdn.com/ats.js';

	call(): Promise<void> {
		if (!this.isEnabled('bidders.liveRampATS.enabled')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			const userEmailHashes = context.get('wiki.opts.userEmailHashes');
			const atsScript = utils.scriptLoader.loadScript(this.atsScriptSrc);

			if (!userEmailHashes) {
				return Promise.resolve();
			}

			return atsScript.then(() => {
				(window as any).ats.start({
					placementID: '2161',
					emailHashes: userEmailHashes,
					storageType: 'localStorage',
					detectionType: 'scrape',
					logging: 'error',
				});

				this.isLoaded = true;
			});
		}
	}
}
