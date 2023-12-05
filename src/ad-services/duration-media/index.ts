import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'duration-media';

export class DurationMedia extends BaseServiceSetup {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (this.isEnabled('icDurationMedia', false) && libraryUrl) {
			utils.logger(logGroup, 'loading', libraryUrl);

			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'duration_media_start',
			});

			utils.scriptLoader.loadScript(libraryUrl, false, null, { id: 'dm-script' }).then(() => {
				utils.logger(logGroup, 'ready');
			});

			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'duration_media_done',
			});
		} else {
			utils.logger(logGroup, 'disabled');
		}
		return Promise.resolve();
	}
}
