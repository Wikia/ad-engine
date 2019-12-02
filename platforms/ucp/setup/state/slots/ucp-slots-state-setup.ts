import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		slotsContext.setState('hivi_leaderboard', true);
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('incontent_boxad_1', false);
		slotsContext.setState('bottom_leaderboard', true);
		slotsContext.setState('incontent_player', false);
		slotsContext.setState('invisible_skin', false);
		slotsContext.setState('floor_adhesion', false);
		slotsContext.setState('invisible_high_impact_2', false);
		slotsContext.setState('featured', false);
	}
}
