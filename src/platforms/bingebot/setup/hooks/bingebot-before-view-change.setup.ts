import { communicationService, eventsRepository, ofType, onlyNew } from '@ad-engine/communication';
import { DiProcess } from '@ad-engine/pipeline';
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
