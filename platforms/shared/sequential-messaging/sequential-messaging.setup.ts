import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	ofType,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';
import { filter, take } from 'rxjs/operators';
import { SequenceContinuationHandler } from './domain/sequence-continuation-handler';
import { SequenceStartHandler } from './domain/sequence-start-handler';
import { SequentialMessagingConfigStore } from './infrastructure/sequential-messaging-config-store';
import { UserSequentialMessageStateStore } from './infrastructure/user-sequential-message-state-store';
import { TargetingManager } from './infrastructure/targeting-manager';
import { Sequence } from './domain/data-structures/sequence';
import { SequenceStateHandlerInterface } from './domain/services/sequence-state-handlers/sequence-state-handler-interface';

interface Action {
	event: string;
	slot: { lineItemId: string; creativeId: string };
}

@Injectable()
export class SequentialMessagingSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute(): Promise<void> {
		console.log('HERE 1');
		if (!this.handleOngoingSequence()) {
			console.log('HERE 2');
			this.detectNewSequentialAd();
		}
	}

	private detectNewSequentialAd(): void {
		communicationService.on(eventsRepository.GAM_SEQUENTIAL_MESSAGING_STARTED, (payload) => {
			console.log('HERE 3');
			console.log(payload);
			const lineItemId = payload.lineItemId;
			const creativeId = payload.creativeId;
			if (lineItemId == null) {
				console.log('HERE 3 A');
				return;
			}
			console.log('HERE 3 B');

			const sequence: Sequence = { id: lineItemId.toString(), stepId: creativeId.toString() };
			const sequenceHandler = new SequenceStartHandler(
				new SequentialMessagingConfigStore(this.instantConfig),
				new UserSequentialMessageStateStore(Cookies),
			);
			sequenceHandler.handleSequence(sequence);
		});
	}

	private handleOngoingSequence(): boolean {
		const sequenceHandler = new SequenceContinuationHandler(
			new SequentialMessagingConfigStore(this.instantConfig),
			new UserSequentialMessageStateStore(Cookies),
			new TargetingManager(context),
			this.handleSequenceStateOnSlotShowedEvent,
		);

		return sequenceHandler.handleOngoingSequence();
	}

	private handleSequenceStateOnSlotShowedEvent(onEvent: SequenceStateHandlerInterface) {
		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
				filter((action: Action) => action.event === 'slotShowed'),
				take(1),
			)
			.subscribe((action) => {
				const sequence: Sequence = { id: action.slot.lineItemId, stepId: action.slot.creativeId };
				onEvent.handleState(sequence);
			});
	}
}
