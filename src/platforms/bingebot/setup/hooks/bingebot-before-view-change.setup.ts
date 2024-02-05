import { communicationService, DiProcess, eventsRepository } from '@wikia/ad-engine';

export class BingeBotBeforeViewChangeSetup implements DiProcess {
	async execute(): Promise<void> {
		const timestamp = Date.now();
		communicationService.on(eventsRepository.BINGEBOT_BEFORE_VIEW_CHANGE, (action) => {
			if (action.timestamp > timestamp) {
				communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);
			}
		});
	}
}
