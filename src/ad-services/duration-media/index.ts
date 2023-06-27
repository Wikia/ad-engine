import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'duration-media';

export class DurationMedia extends BaseServiceSetup {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (this.isEnabled('icDurationMedia', false) || !libraryUrl) {
			// DM is refreshing slots, so let's load it only after at least one slot is filled
			communicationService.on(
				eventsRepository.AD_ENGINE_SLOT_LOADED,
				() => {
					utils.logger(logGroup, 'loading', libraryUrl);

					utils.scriptLoader
						.loadScript(libraryUrl, 'text/javascript', false, null, {
							id: 'dm-script',
						})
						.then(() => {
							utils.logger(logGroup, 'ready');
						});
				},
				true,
			);
		} else {
			utils.logger(logGroup, 'disabled');
		}
		return Promise.resolve();
	}
}
