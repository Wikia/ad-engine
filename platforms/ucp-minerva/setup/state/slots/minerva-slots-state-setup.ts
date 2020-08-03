import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaSlotsStateSetup implements SlotsStateSetup {
	execute(): void {
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('incontent_boxad_1', true);
		slotsContext.setState('footer_boxad', true);
	}
}
