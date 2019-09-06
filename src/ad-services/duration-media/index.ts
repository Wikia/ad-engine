import { context, utils } from '@ad-engine/core';

const logGroup = 'duration-media';

class DurationMedia {
	call(): Promise<void> {
		const siteId: string = context.get('services.durationMedia.siteId');

		if (!context.get('services.durationMedia.enabled') || !siteId) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//pr.realvu.net/flip/2/c=E4KZ_f=site_si=${siteId}`;

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const durationMedia = new DurationMedia();
