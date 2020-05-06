import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('incontent_boxad_1', true);
		slotsContext.setState('bottom_leaderboard', true);
	}
}
