import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	distroScale,
	getAdProductInfo,
	InstantConfigService,
	ofType,
	slotDataParamsUpdater,
	slotService,
	uapLoadStatus,
	utils,
	VideoParams,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';

@Injectable()
export class UcpSlotsStateSetup implements DiProcess {
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

	private distroScaleIU(adSlot: AdSlot, params: VideoParams): string {
		const adProductInfo = getAdProductInfo(adSlot.getSlotName(), params.type, params.adProduct);
		const adUnit = utils.stringBuilder.build(
			context.get(`slots.${adSlot.getSlotName()}.videoAdUnit`) || context.get('vast.adUnitId'),
			{
				slotConfig: {
					group: adProductInfo.adGroup,
					adProduct: adSlot.getSlotName(),
					slotNameSuffix: '',
				},
			},
		);
		return adUnit;
	}

	// TODO: make it more clean
	private setDistroscaleVarInRuntime(slotName: string): void {
		const params = {
			slotName,
			type: 'porvata3',
			adProduct: 'incontent_veles',
		};
		const newAdSlot = new AdSlot({ id: slotName });
		const distroscaleIU = this.distroScaleIU(newAdSlot, params);
		window.ads.runtime = window.ads.runtime || ({} as Runtime);
		window.ads.runtime.distroscale = window.ads.runtime.distroscale || {};
		window.ads.runtime.distroscale.adUnit = distroscaleIU;
	}

	private setupIncontentPlayerForDistroScale(): void {
		const slotName = 'incontent_player';
		this.setDistroscaleVarInRuntime(slotName);

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
