import { communicationService, context, utils } from '@wikia/ad-engine';
import Cookies from 'js-cookie';
import { SequenceContinuationHandler } from './domain/sequence-continuation-handler';
import { SequenceStartHandler } from './domain/sequence-start-handler';
import { UserSequentialMessageStateStore } from './infrastructure/user-sequential-message-state-store';
import { GamTargetingManager } from './infrastructure/gam-targeting-manager';
import { slotsContext } from '../slots/slots-context';
import { SequenceEndHandler } from './domain/sequence-end-handler';
import { SequenceEventTypes } from './infrastructure/sequence-event-types';

export class SequentialMessagingSetup {
	// Special targeting sizes are aligned with sequence steps e.g.
	// step 2 is targeted using size 12x12
	// step 3 is targeted using size 13x13
	static readonly baseTargetingSize = 10;
	private readonly userStateStore: UserSequentialMessageStateStore;

	constructor() {
		this.userStateStore = new UserSequentialMessageStateStore(Cookies);
	}

	async execute(): Promise<void> {
		// This will only work when we assume allowing one sequence at a time to be in progress
		if (this.userStateStore.get() == null) {
			this.handleSequenceStart();
			return;
		}
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

			const sequenceHandler = new SequenceStartHandler(this.userStateStore);
			sequenceHandler.startSequence(lineItemId, width, height);
		});
	}

	private handleOngoingSequence(): void {
		const sequenceHandler = new SequenceContinuationHandler(
			this.userStateStore,
			new GamTargetingManager(context, slotsContext, SequentialMessagingSetup.baseTargetingSize),
			this.onIntermediateStepLoad,
		);

		sequenceHandler.handleOngoingSequence();
	}

	private handleSequenceEnd(): void {
		communicationService.on(SequenceEventTypes.SEQUENTIAL_MESSAGING_END, () => {
			const sequenceHandler = new SequenceEndHandler(this.userStateStore);
			sequenceHandler.endSequence();
		});
	}

	private onIntermediateStepLoad(storeState: (loadedStep: number) => void) {
		communicationService.on(SequenceEventTypes.SEQUENTIAL_MESSAGING_INTERMEDIATE, (payload) => {
			// TODO SM extract the 12 and 14 number to a shared parameters
			//  to be used here and in GamTargetingManager.generateSizeMapping
			if (!payload.height || 12 > payload.height || payload.height > 14) {
				utils.logger('SM', 'Invalid Creative configuration. Creative size ot ouf bounds.');
				return false;
			}

			const loadedStep = payload.height - SequentialMessagingSetup.baseTargetingSize;
			storeState(loadedStep);
		});
	}
}
