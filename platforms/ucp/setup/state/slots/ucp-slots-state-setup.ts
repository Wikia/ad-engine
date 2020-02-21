import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		slotsContext.setState('hivi_leaderboard', !!context.get('options.hiviLeaderboard'));
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('bottom_leaderboard', true);
		slotsContext.setState('incontent_player', false);
		slotsContext.setState('invisible_skin', false);
		slotsContext.setState('floor_adhesion', false);
		slotsContext.setState('invisible_high_impact_2', false);
		slotsContext.setState('featured', false);
	}
}
