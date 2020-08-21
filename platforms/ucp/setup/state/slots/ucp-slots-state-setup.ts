import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	context,
	DiProcess,
	distroScale,
	InstantConfigService,
	slotDataParamsUpdater,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpSlotsStateSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): void {
		slotsContext.setState('hivi_leaderboard', !!context.get('options.hiviLeaderboard'));
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('bottom_leaderboard', true);
		slotsContext.setState('invisible_skin', false);
		slotsContext.setState('floor_adhesion', this.instantConfig.get('icFloorAdhesion'));
		slotsContext.setState('invisible_high_impact_2', !this.instantConfig.get('icFloorAdhesion'));

		slotService.setState('featured', context.get('custom.hasFeaturedVideo'));
		slotsContext.setState('incontent_player', context.get('custom.hasIncontentPlayer'));

		if (context.get('services.distroScale.enabled')) {
			// It is required to *collapse* ICP for DistroScale
			// TODO: clean up once we finish DS A/B test
			this.setupIncontentPlayerForDistroScale();
		}
	}

	private setupIncontentPlayerForDistroScale(): void {
		const slotName = 'incontent_player';

		slotService.setState(slotName, false, AdSlot.STATUS_COLLAPSE);
		slotService.on(slotName, AdSlot.STATUS_COLLAPSE, () => {
			slotDataParamsUpdater.updateOnCreate(slotService.get(slotName));
			distroScale.call();
		});
	}
}
