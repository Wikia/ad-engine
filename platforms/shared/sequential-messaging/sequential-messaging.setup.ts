import { communicationService, context } from '@wikia/ad-engine';
import Cookies from 'js-cookie';
import { SequenceContinuationHandler } from './domain/sequence-continuation-handler';
import { SequenceStartHandler } from './domain/sequence-start-handler';
import { UserSequentialMessageStateStore } from './infrastructure/user-sequential-message-state-store';
import { GamTargetingManager } from './infrastructure/gam-targeting-manager';
import { slotsContext } from '../slots/slots-context';
import { SequenceEndHandler } from './domain/sequence-end-handler';
import { sequenceEventsTypes } from './infrastructure/sequence-event-types';

export class SequentialMessagingSetup {
	async execute(): Promise<void> {
		this.detectNewSequentialAd();
		this.handleOngoingSequence();
		this.detectSequentialAdEnd();
	}

	private detectNewSequentialAd(): void {
		communicationService.on(sequenceEventsTypes.GAM_SEQUENTIAL_MESSAGING_STARTED, (payload) => {
			const lineItemId = payload.lineItemId;
			if (lineItemId == null) {
				return;
			}

			const sequenceHandler = new SequenceStartHandler(
				new UserSequentialMessageStateStore(Cookies),
			);
			sequenceHandler.startSequence(lineItemId);
		});
	}

	private handleOngoingSequence(): void {
		const sequenceHandler = new SequenceContinuationHandler(
			new UserSequentialMessageStateStore(Cookies),
			new GamTargetingManager(context, slotsContext),
		);

		sequenceHandler.handleOngoingSequence();
	}

	private detectSequentialAdEnd(): void {
		communicationService.on(sequenceEventsTypes.GAM_SEQUENTIAL_MESSAGING_END, () => {
			const sequenceHandler = new SequenceEndHandler(new UserSequentialMessageStateStore(Cookies));
			sequenceHandler.endSequence();
		});
	}
}
