import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';
import { ContextInterface } from '@wikia/ad-engine';
import { SlotsContextInterface } from '../../slots/slots-context';
import { SequenceState } from '../domain/data-structures/user-sequential-message-state';

export class GamTargetingManager implements TargetingManagerInterface {
	readonly UAP_MOBILE_WIDTH = 2;
	readonly UAP_DESKTOP_WIDTH = 3;

	constructor(
		private context: ContextInterface,
		private slotsContext: SlotsContextInterface,
		private baseTargetingSize: number,
		private forceUapResolveState: () => void,
	) {}

	setTargeting(sequenceId: string, userState: SequenceState): void {
		const sizeSide = this.baseTargetingSize + userState.stepNo;
		this.slotsContext.setSlotSize('top_leaderboard', [sizeSide, sizeSide]);
		this.context.set(
			'templates.sizeOverwritingMap',
			this.generateSizeMapping(userState.width, userState.height),
		);
		this.context.set('slots.top_leaderboard.targeting.sequential', sequenceId);

		if (this.isUap(userState)) {
			this.forceUapResolveState();
		}
	}

	private isUap(userState: SequenceState) {
		return userState.width === this.UAP_MOBILE_WIDTH || userState.width === this.UAP_DESKTOP_WIDTH;
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
