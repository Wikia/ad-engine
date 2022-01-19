import {
	communicationService,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	ofType,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';
import { filter, take } from 'rxjs/operators';
import { SequenceHandler } from './sequence-handler';

@Injectable()
export class SequentialMessagingSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute(): Promise<void> {
		interface Action {
			event: string;
			slot: { lineItemId: string };
		}

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
				filter((action: Action) => action.event === 'slotShowed'),
				take(1),
			)
			.subscribe((action) => {
				const lineItemId = action.slot.lineItemId;
				if (lineItemId == null) {
					return;
				}

				const sequenceHandler = new SequenceHandler(this.instantConfig, Cookies);
				sequenceHandler.handleItem(lineItemId);
			});
	}
}
