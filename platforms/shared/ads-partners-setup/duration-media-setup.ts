import { BaseServiceSetup, context, utils } from '@wikia/ad-engine';

const logGroup = 'duration-media';

class DurationMediaSetup extends BaseServiceSetup {
	initialize() {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (!context.get('services.durationMedia.enabled') || !libraryUrl) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			utils.logger(logGroup, 'loading', libraryUrl);

			return utils.scriptLoader
				.loadScript(libraryUrl, 'text/javascript', true, null, {
					id: 'dm-script',
				})
				.then(() => {
					utils.logger(logGroup, 'ready');
					this.res();
				});
		}
	}
}

export const durationMediaSetup = new DurationMediaSetup();
