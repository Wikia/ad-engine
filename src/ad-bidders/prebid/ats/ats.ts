import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'ATS';

class Ats extends BaseServiceSetup {
	private isLoaded = false;
	private atsScriptSrc = 'https://ats.rlcdn.com/ats.js';

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			const userEmailHashes = context.get('wiki.opts.userEmailHashes');

			if (!userEmailHashes) {
				return Promise.resolve();
			}

			return utils.scriptLoader.loadScript(this.atsScriptSrc).then(() => {
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

	private isEnabled(): boolean {
		return (
			context.get('bidders.liveRampATS.enabled') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}
}

export const ats = new Ats();
