import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';
import { ContextInterface } from '@wikia/ad-engine';
import { SlotsContextInterface } from '../../slots/slots-context';

export class GamTargetingManager implements TargetingManagerInterface {
	private baseSize = 10;
	private sizeMapping = {
		'11x11': { originalSize: [970, 250] },
		'12x12': { originalSize: [970, 250] },
		'13x13': { originalSize: [970, 250] },
		'14x14': { originalSize: [970, 250] },
	};

	constructor(private context: ContextInterface, private slotsContext: SlotsContextInterface) {}

	setTargeting(sequenceId: string, stepNo: number): void {
		const sizeSide = this.baseSize + stepNo;

		this.slotsContext.setSlotSize('top_leaderboard', [sizeSide, sizeSide]);

		this.context.set('templates.sizeOverwritingMap', this.sizeMapping);

		this.context.set('targeting.uap', sequenceId);
	}
}
