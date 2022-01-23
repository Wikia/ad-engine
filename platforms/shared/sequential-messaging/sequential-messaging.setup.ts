import {
	communicationService,
	DiProcess,
	eventsRepository,
	ofType,
	SequenceHandler,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { filter, take } from 'rxjs/operators';
import { CookieSequentialMessageStateStore } from './infrastructure/cookie-sequential-message-state-store';
import { SlotSequenceInstantConfigSupplier } from './infrastructure/slot-sequence-instant-config-supplier';

@Injectable()
export class SequentialMessagingSetup implements DiProcess {
	private sequenceHandler: SequenceHandler<string>;

	constructor(
		slotSequenceProvider: SlotSequenceInstantConfigSupplier,
		stateStore: CookieSequentialMessageStateStore,
	) {
		this.sequenceHandler = new SequenceHandler(slotSequenceProvider, stateStore, {
			get(): number {
				return Date.now();
			},
		});
	}

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
				this.sequenceHandler.getSequenceForSlot(lineItemId);
			});
	}
}
