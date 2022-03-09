import { communicationService, context } from '@wikia/ad-engine';
import Cookies from 'js-cookie';
import { SequenceContinuationHandler } from './domain/sequence-continuation-handler';
import { SequenceStartHandler } from './domain/sequence-start-handler';
import { UserSequentialMessageStateStore } from './infrastructure/user-sequential-message-state-store';
import { GamTargetingManager } from './infrastructure/gam-targeting-manager';
import { slotsContext } from '../slots/slots-context';
import { SequenceEndHandler } from './domain/sequence-end-handler';
import { SequenceEventTypes } from './infrastructure/sequence-event-types';

export class SequentialMessagingSetup {
	async execute(): Promise<void> {
		this.handleSequenceStart();
		this.handleOngoingSequence();
		this.handleSequenceEnd();
	}

	private handleSequenceStart(): void {
		communicationService.on(SequenceEventTypes.SEQUENTIAL_MESSAGING_STARTED, (payload) => {
			const lineItemId = payload.lineItemId;
			const width = payload.width;
			const height = payload.height;
			if (lineItemId == null || width == null || height == null) {
				return;
			}

			const sequenceHandler = new SequenceStartHandler(
				new UserSequentialMessageStateStore(Cookies),
			);
			sequenceHandler.startSequence(lineItemId, width, height);
		});
	}

	private handleOngoingSequence(): void {
		const sequenceHandler = new SequenceContinuationHandler(
			new UserSequentialMessageStateStore(Cookies),
			new GamTargetingManager(context, slotsContext),
		);

		sequenceHandler.handleOngoingSequence();
	}

	private handleSequenceEnd(): void {
		communicationService.on(SequenceEventTypes.SEQUENTIAL_MESSAGING_END, () => {
			const sequenceHandler = new SequenceEndHandler(new UserSequentialMessageStateStore(Cookies));
			sequenceHandler.endSequence();
		});
	}
}
