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
import { SequenceHandler } from './domain/sequence-handler';
import { SequentialMessagingConfigStore } from './infrastructure/sequential-messaging-config-store';
import { UserSequentialMessageStateStore } from './infrastructure/user-sequential-message-state-store';

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

				const sequenceHandler = new SequenceHandler(
					new SequentialMessagingConfigStore(this.instantConfig),
					new UserSequentialMessageStateStore(Cookies),
				);
				sequenceHandler.handleItem(lineItemId);
			});
	}
}
