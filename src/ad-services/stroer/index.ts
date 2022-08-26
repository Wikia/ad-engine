import { context, PartnerServiceStage, utils } from '@ad-engine/core';
// eslint-disable-next-line no-restricted-imports
import { Service } from '@ad-engine/services';

const logGroup = 'stroer';

@Service({
	stage: PartnerServiceStage.preProvider,
})
class Stroer {
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

export const stroer = new Stroer();
