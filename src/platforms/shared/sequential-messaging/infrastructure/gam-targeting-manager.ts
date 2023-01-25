import { ContextInterface } from '@wikia/ad-engine';
import { SlotsContextInterface } from '../../slots/slots-context';
import { SequenceState } from '../domain/data-structures/user-sequential-message-state';
import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';

export class GamTargetingManager implements TargetingManagerInterface {
	constructor(
		private context: ContextInterface,
		private slotsContext: SlotsContextInterface,
		private baseTargetingSize: number,
		private forceUapResolveState: () => void,
	) {}

	setTargeting(sequenceId: string, sequenceState: SequenceState): void {
		const sizeSide = this.baseTargetingSize + sequenceState.stepNo;
		this.slotsContext.setSlotSize('top_leaderboard', [sizeSide, sizeSide]);
		this.context.set(
			'templates.sizeOverwritingMap',
			this.generateSizeMapping(sequenceState.width, sequenceState.height),
		);
		this.context.set('slots.top_leaderboard.targeting.sequential', sequenceId);

		if (sequenceState.isUap()) {
			this.forceUapResolveState();
		}
	}

	private generateSizeMapping(width: number, height: number) {
		// TODO SM build this using 'computed keys'
		return {
			'12x12': { originalSize: [width, height] },
			'13x13': { originalSize: [width, height] },
			'14x14': { originalSize: [width, height] },
		};
	}
}
