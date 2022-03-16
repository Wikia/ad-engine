import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';
import { ContextInterface } from '@wikia/ad-engine';
import { SlotsContextInterface } from '../../slots/slots-context';
import { SequenceState } from '../domain/data-structures/user-sequential-message-state';

export class GamTargetingManager implements TargetingManagerInterface {
	private baseSize = 10;

	constructor(private context: ContextInterface, private slotsContext: SlotsContextInterface) {}

	setTargeting(sequenceId: string, userState: SequenceState): void {
		const sizeSide = this.baseSize + userState.stepNo;
		this.slotsContext.setSlotSize('top_leaderboard', [sizeSide, sizeSide]);
		this.context.set(
			'templates.sizeOverwritingMap',
			this.generateSizeMapping(userState.width, userState.height),
		);
		this.context.set('targeting.uap', sequenceId);
		// This is needed for F2 / News & stories
		this.context.set('slots.top_leaderboard.targeting.uap', sequenceId);
	}

	private generateSizeMapping(width: number, height: number) {
		return {
			'12x12': { originalSize: [width, height] },
			'13x13': { originalSize: [width, height] },
			'14x14': { originalSize: [width, height] },
		};
	}
}
