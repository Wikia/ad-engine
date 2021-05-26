import { context, utils } from '@ad-engine/core';

const logGroup = 'Stroer';

class Stroer {
	call(): Promise<void> {
		if (!context.get('services.stroer.enabled')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//js.adscale.de/map.js`;

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const stroer = new Stroer();
