import { context, utils } from '@ad-engine/core';

const logGroup = 'duration-media';

class DurationMedia {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (!context.get('services.durationMedia.enabled') || !libraryUrl) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader
			.loadScript({ src: libraryUrl, parameters: {
				id: 'dm-script',
			}})
			.then(() => {
				utils.logger(logGroup, 'ready');
			});
	}
}

export const durationMedia = new DurationMedia();
