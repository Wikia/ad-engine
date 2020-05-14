import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { context, InstantConfigService, slotService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpSlotsStateSetup implements SlotsStateSetup {
	constructor(private instantConfig: InstantConfigService) {}

	configureSlotsState(): void {
		slotsContext.setState('hivi_leaderboard', !!context.get('options.hiviLeaderboard'));
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('bottom_leaderboard', true);
		slotsContext.setState('invisible_skin', false);
		slotsContext.setState('floor_adhesion', this.instantConfig.get('icFloorAdhesion'));
		slotsContext.setState('invisible_high_impact_2', !this.instantConfig.get('icFloorAdhesion'));

		slotService.setState('featured', context.get('custom.hasFeaturedVideo'));
		slotsContext.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
	}
}
