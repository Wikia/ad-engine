import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	distroScale,
	InstantConfigService,
	ofType,
	slotDataParamsUpdater,
	slotService,
	uapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';

@Injectable()
export class UcpDesktopSlotsStateSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): void {
		slotsContext.setState('hivi_leaderboard', !!context.get('options.hiviLeaderboard'));
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', this.isRightRailApplicable());
		slotsContext.setState('affiliate_slot', this.isAffiliateSlotEnabled());
		slotsContext.setState('bottom_leaderboard', true);
		slotsContext.setState('invisible_skin', false);
		slotsContext.setState(
			'floor_adhesion',
			this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo'),
		);
		slotsContext.setState(
			'invisible_high_impact_2',
			!this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo'),
		);

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

			communicationService.action$
				.pipe(ofType(uapLoadStatus), take(1))
				.subscribe(({ isLoaded }) => {
					if (!isLoaded) {
						distroScale.call();
					}
				});
		});
	}

	private isRightRailApplicable(): boolean {
		return utils.getViewportWidth() >= 1024;
	}

	private isAffiliateSlotEnabled(): boolean {
		return (
			this.isRightRailApplicable() &&
			context.get('wiki.opts.enableAffiliateSlot') &&
			!context.get('custom.hasFeaturedVideo')
		);
	}
}
