import {
	insertSlots,
	NativoSlotsDefinitionRepository,
	PlaceholderService,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	fillerService,
	PorvataFiller,
	PorvataGamParams,
	slotService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpDesktopSlotsDefinitionRepository } from './ucp-desktop-slots-definition-repository';

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository,
		private nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboardAndCompanions();
		this.configureIncontentPlayerFiller();
		this.configureFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
	}

	private injectSlots(): void {
		insertSlots([
			this.nativoSlotDefinitionRepository.getNativoIncontentAdConfig(2),
			this.nativoSlotDefinitionRepository.getNativoFeedAdConfig(),
			this.slotsDefinitionRepository.getTopLeaderboardConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getIncontentPlayerConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
		]);

		communicationService.on(eventsRepository.RAIL_READY, () => {
			insertSlots([this.slotsDefinitionRepository.getIncontentBoxadConfig()]);
		});
	}

	private configureTopLeaderboardAndCompanions(): void {
		const slotName = 'top_leaderboard';

		slotsContext.addSlotSize(
			'top_boxad',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
		);

		if (
			(!context.get('custom.hasFeaturedVideo') || context.get('templates.stickyTlb.withFV')) &&
			(context.get('templates.stickyTlb.forced') || context.get('templates.stickyTlb.lineItemIds'))
		) {
			context.push(`slots.${slotName}.defaultTemplates`, 'stickyTlb');
		}

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('wiki.targeting.pageType') !== 'special') {
				slotsContext.addSlotSize(slotName, universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop);
			}

			slotsContext.addSlotSize(
				'incontent_boxad_1',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
			);
		} else {
			context.set('slots.incontent_boxad_1.defaultSizes', [[300, 250]]);
			slotsContext.addSlotSize(
				'incontent_boxad_1',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
			);
		}
	}

	private configureIncontentPlayerFiller(): void {
		const icpSlotName = 'incontent_player';
		const fillerOptions: Partial<PorvataGamParams> = {
			enableInContentFloating: true,
		};

		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, fillerOptions);

		fillerService.register(new PorvataFiller());
	}

	private configureFloorAdhesionCodePriority(): void {
		const slotName = 'floor_adhesion';
		let porvataClosedActive = false;

		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				porvataClosedActive = true;

				communicationService.onSlotEvent(AdSlot.VIDEO_AD_IMPRESSION, () => {
					if (porvataClosedActive) {
						porvataClosedActive = false;
						slotService.disable(slotName, AdSlot.STATUS_CLOSED_BY_PORVATA);
					}
				});
			},
			slotName,
		);

		communicationService.onSlotEvent(
			AdSlot.HIDDEN_EVENT,
			() => {
				porvataClosedActive = false;
			},
			slotName,
		);
	}

	private registerAdPlaceholderService(): void {
		const placeholderService = new PlaceholderService();
		placeholderService.init();
	}
}
