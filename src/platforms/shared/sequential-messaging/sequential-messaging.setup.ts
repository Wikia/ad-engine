import { communicationService, context, resolvedState, utils } from '@wikia/ad-engine';
import Cookies from 'js-cookie';
import { slotsContext } from '../slots/slots-context';
import { SequenceContinuationHandler } from './domain/sequence-continuation-handler';
import { SequenceEndHandler } from './domain/sequence-end-handler';
import { SequenceStartHandler } from './domain/sequence-start-handler';
import { GamTargetingManager } from './infrastructure/gam-targeting-manager';
import { SequenceEventTypes } from './infrastructure/sequence-event-types';
import { UserSequentialMessageStateStore } from './infrastructure/user-sequential-message-state-store';
import { KibanaLogger } from './kibana-logger';

function kibanaLogger() {
	// This is to ensure Kibana logging will work on F2
	if (!context.get('services.externalLogger.endpoint')) {
		context.set(
			'services.externalLogger.endpoint',
			'https://community.fandom.com/wikia.php?controller=AdEngine&method=postLog',
		);
	}

	window['smTracking'] = new KibanaLogger();
}

function recordGAMCreativePayload(payload) {
	if (window['smTracking'] == undefined) {
		kibanaLogger();
	}

	window['smTracking'].recordGAMCreativePayload(payload);
}

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
			const uap = payload.uap === undefined ? false : payload.uap;
			if (lineItemId == null || width == null || height == null) {
				return;
			}

			if (uap) {
				resolvedState.forceUapResolveState();
			}

			const sequenceHandler = new SequenceStartHandler(this.userStateStore);
			sequenceHandler.startSequence(lineItemId, width, height, uap);

			recordGAMCreativePayload(payload);
		});
	}

	private handleOngoingSequence(): void {
		const targetingManager = new GamTargetingManager(
			context,
			slotsContext,
			SequentialMessagingSetup.baseTargetingSize,
			resolvedState.forceUapResolveState,
		);

		const sequenceHandler = new SequenceContinuationHandler(
			this.userStateStore,
			targetingManager,
			this.onIntermediateStepLoad,
			context.get('custom.hasFeaturedVideo'),
		);

		sequenceHandler.handleOngoingSequence();
	}

	private handleSequenceEnd(): void {
		communicationService.on(SequenceEventTypes.SEQUENTIAL_MESSAGING_END, (payload) => {
			const sequenceHandler = new SequenceEndHandler(this.userStateStore);
			sequenceHandler.endSequence();

			recordGAMCreativePayload(payload);
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

			recordGAMCreativePayload(payload);
		});
	}
}
