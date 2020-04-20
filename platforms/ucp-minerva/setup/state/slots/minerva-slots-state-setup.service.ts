import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('footer', true);
	}
}
