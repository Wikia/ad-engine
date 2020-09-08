import {
	communicationService,
	DiProcess,
	events,
	eventService,
	ofType,
	onlyNew,
} from '@wikia/ad-engine';
import { beforeViewChange } from '../../setup-bingebot';

export class BingeBotBeforeViewChangeSetup implements DiProcess {
	async execute(): Promise<void> {
		communicationService.action$.pipe(ofType(beforeViewChange), onlyNew()).subscribe(() => {
			eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);
		});
	}
}
