import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'stroer';

class StroerDeprecated extends BaseServiceSetup {
	call(): Promise<void> {
		if (!context.get('services.stroer.enabled')) {
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

export const stroerDeprecated = new StroerDeprecated();
