import { BaseServiceSetup, utils } from '@ad-engine/core';

const logGroup = 'stroer';

export class Stroer extends BaseServiceSetup {
	call(): Promise<void> {
		if (!this.isEnabled('icStroer', false)) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//js.adscale.de/map.js`;

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}
