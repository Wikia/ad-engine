import {
	insertSlots,
	PlaceholderService,
	PlaceholderServiceHelper,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	context,
	DiProcess,
	events,
	eventService,
	fillerService,
	PorvataFiller,
	PorvataGamParams,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpDesktopSlotsDefinitionRepository } from './ucp-desktop-slots-definition-repository';

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
		this.configureIncontentBoxad();
		this.configureIncontentPlayerFiller();
		this.configureFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
	}

	private injectSlots(): void {
		insertSlots([
			this.slotsDefinitionRepository.getNativoIncontentAdConfig(),
			this.slotsDefinitionRepository.getNativoFeedAdConfig(),
			this.slotsDefinitionRepository.getTopLeaderboardConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getIncontentPlayerConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
		]);
	}

	private configureTopLeaderboard(): void {
		const slotName = 'top_leaderboard';

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('wiki.targeting.pageType') !== 'special') {
				slotsContext.addSlotSize(slotName, [3, 3]);
			}

			if (
				context.get('templates.stickyTlb.forced') ||
				context.get('templates.stickyTlb.lineItemIds')
			) {
				context.push(`slots.${slotName}.defaultTemplates`, 'stickyTlb');
			}
		}
	}

	private configureIncontentBoxad(): void {
		const icbSlotName = 'incontent_boxad_1';

		if (context.get('custom.hasFeaturedVideo')) {
			context.set(`slots.${icbSlotName}.defaultSizes`, [300, 250]);
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
		let porvataClosedActive = false;

		slotService.on('floor_adhesion', AdSlot.STATUS_SUCCESS, () => {
			porvataClosedActive = true;

			eventService.on(events.VIDEO_AD_IMPRESSION, () => {
				if (porvataClosedActive) {
					porvataClosedActive = false;
					slotService.disable('floor_adhesion', AdSlot.STATUS_CLOSED_BY_PORVATA);
				}
			});
		});

		slotService.on('floor_adhesion', AdSlot.HIDDEN_EVENT, () => {
			porvataClosedActive = false;
		});
	}

	private registerAdPlaceholderService(): void {
		const placeholderHelper = new PlaceholderServiceHelper();
		const placeholderService = new PlaceholderService(placeholderHelper);
		placeholderService.init();
	}
}
