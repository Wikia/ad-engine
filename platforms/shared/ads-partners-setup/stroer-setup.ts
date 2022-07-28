import { BaseServiceSetup, context, utils } from '@wikia/ad-engine';

const logGroup = 'stroer';

class StroerSetup extends BaseServiceSetup {
	initialize() {
		if (!context.get('services.stroer.enabled')) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			const libraryUrl = `//js.adscale.de/map.js`;

			utils.logger(logGroup, 'loading', libraryUrl);

			return utils.scriptLoader.loadScript(libraryUrl).then(() => {
				utils.logger(logGroup, 'ready');
				this.res();
			});
		}
	}
}

export const stroerSetup = new StroerSetup();
