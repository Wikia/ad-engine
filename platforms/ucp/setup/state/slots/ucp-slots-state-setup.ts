import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		if (context.get('targeting.skin') === 'hydra') {
			slotsContext.setState('cdm-zone-01', true);
			slotsContext.setState('cdm-zone-02', true);
			slotsContext.setState('cdm-zone-03', true);
			slotsContext.setState('cdm-zone-04', !context.get('state.isMobile'));
			slotsContext.setState('cdm-zone-06', true);
		} else {
			slotsContext.setState('hivi_leaderboard', !!context.get('options.hiviLeaderboard'));
			slotsContext.setState('top_leaderboard', true);
			slotsContext.setState('top_boxad', true);
			slotsContext.setState('bottom_leaderboard', true);
			slotsContext.setState('invisible_skin', false);
			slotsContext.setState('floor_adhesion', false);
			slotsContext.setState('invisible_high_impact_2', false);

			slotsContext.setState('featured', context.get('custom.hasFeaturedVideo'));
			slotsContext.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
		}
	}
}
