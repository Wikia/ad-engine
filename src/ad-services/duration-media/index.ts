import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'duration-media';

export class DurationMedia extends BaseServiceSetup {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (this.isEnabled('icDurationMedia', false) && libraryUrl) {
			// DM is using GPT events to listen on slot render, so let's load it after GPT
			communicationService.on(
				eventsRepository.AD_ENGINE_GPT_READY,
				() => {
					utils.logger(logGroup, 'loading', libraryUrl);

					utils.scriptLoader
						.loadScript(libraryUrl, false, null, {
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
