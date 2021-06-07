import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	distroScale,
	getAdUnitString,
	globalRuntimeVariableSetter,
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

	private setDistroscaleVarInRuntime(slotName: string): void {
		const params = {
			group: 'VIDEO',
			adProduct: 'incontent_video',
			slotNameSuffix: '',
		};

		const distroscaleIU = getAdUnitString(slotName, params);

		globalRuntimeVariableSetter.addNewVariableToRuntime('distroscale', { adUnit: distroscaleIU });
	}

	private setupIncontentPlayerForDistroScale(): void {
		const slotName = 'incontent_player';
		this.setDistroscaleVarInRuntime(slotName);
		context.set('slots.incontent_player.targeting.pos', ['incontent_video']);

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
