import {
	communicationService,
	DiProcess,
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
				communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);
			});
	}
}
