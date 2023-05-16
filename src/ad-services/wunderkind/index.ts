import { BaseServiceSetup, utils } from '@ad-engine/core';

const logGroup = 'wunderkind';

export class Wunderkind extends BaseServiceSetup {
	call(): Promise<void> {
		if (!this.instantConfig.get('icWunderkind')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		const libraryUrl = `//tag.wknd.ai/5047/i.js`;
		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}
