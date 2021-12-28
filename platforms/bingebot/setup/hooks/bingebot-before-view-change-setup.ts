import {
	communicationService,
	DiProcess,
	events,
	eventService,
	eventsRepository,
	ofType,
	onlyNew,
} from '@wikia/ad-engine';

export class BingeBotBeforeViewChangeSetup implements DiProcess {
	async execute(): Promise<void> {
		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.BINGEBOT_BEFORE_VIEW_CHANGE)),
				onlyNew(),
			)
			.subscribe(() => {
				eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);
			});
	}
}
