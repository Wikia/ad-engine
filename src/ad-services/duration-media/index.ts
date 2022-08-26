import { context, PartnerServiceStage, utils } from '@ad-engine/core';
// eslint-disable-next-line no-restricted-imports
import { Service } from '@ad-engine/services';

const logGroup = 'duration-media';

@Service({
	stage: PartnerServiceStage.preProvider,
})
class DurationMedia {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (!context.get('services.durationMedia.enabled') || !libraryUrl) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, {
				id: 'dm-script',
			})
			.then(() => {
				utils.logger(logGroup, 'ready');
			});
	}
}

export const durationMedia = new DurationMedia();
