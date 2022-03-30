import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';
import { ContextInterface } from '@wikia/ad-engine';
import { SlotsContextInterface } from '../../slots/slots-context';
import { SequenceState } from '../domain/data-structures/user-sequential-message-state';

export class GamTargetingManager implements TargetingManagerInterface {
	constructor(
		private context: ContextInterface,
		private slotsContext: SlotsContextInterface,
		private baseTargetingSize: number,
	) {}

	setTargeting(sequenceId: string, userState: SequenceState): void {
		const sizeSide = this.baseTargetingSize + userState.stepNo;
		this.slotsContext.setSlotSize('top_leaderboard', [sizeSide, sizeSide]);
		this.context.set(
			'templates.sizeOverwritingMap',
			this.generateSizeMapping(userState.width, userState.height),
		);
		this.context.set('slots.top_leaderboard.targeting.sequential', sequenceId);
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
