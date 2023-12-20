import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'duration-media';

export class DurationMedia extends BaseServiceSetup {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (this.isEnabled('icDurationMedia', false) && libraryUrl) {
			utils.logger(logGroup, 'loading', libraryUrl);

			utils.timedPartnerScriptLoader
				.loadScriptWithStatus(libraryUrl, logGroup, false, null, { id: 'dm-script' })
				.then(() => {
					utils.logger(logGroup, 'ready');
				});
		} else {
			utils.logger(logGroup, 'disabled');
		}
		return Promise.resolve();
	}
}
