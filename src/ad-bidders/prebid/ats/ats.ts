import { context, utils } from '@ad-engine/core';

const logGroup = 'ATS';

class Ats {
	private isLoaded = false;
	private atsScriptSrc = 'https://ats.rlcdn.com/ats.js';

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			// tslint:disable-next-line:tsl-ban-snippets
			return utils.scriptLoader.loadScript(this.atsScriptSrc).then(() => {
				(window as any).ats.start({
					placementID: '2161',
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
