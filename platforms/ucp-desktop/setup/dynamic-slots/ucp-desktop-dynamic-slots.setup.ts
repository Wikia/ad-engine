import {
	insertSlots,
	PlaceholderService,
	PlaceholderServiceHelper,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	events,
	eventService,
	fillerService,
	globalAction,
	ofType,
	PorvataFiller,
	PorvataGamParams,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { UcpDesktopSlotsDefinitionRepository } from './ucp-desktop-slots-definition-repository';

const railReady = globalAction('[Rail] Ready');

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
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getIncontentPlayerConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
		]);

		communicationService.action$.pipe(ofType(railReady), take(1)).subscribe(() => {
			insertSlots([this.slotsDefinitionRepository.getIncontentBoxadConfig()]);
		});
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
		if (context.get('custom.hasFeaturedVideo')) {
			context.set('slots.incontent_boxad_1.defaultSizes', [300, 250]);
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

		slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
			porvataClosedActive = true;

			eventService.on(events.VIDEO_AD_IMPRESSION, () => {
				if (porvataClosedActive) {
					porvataClosedActive = false;
					slotService.disable(slotName, AdSlot.STATUS_CLOSED_BY_PORVATA);
				}
			});
		});

		slotService.on(slotName, AdSlot.HIDDEN_EVENT, () => {
			porvataClosedActive = false;
		});
	}

	private registerAdPlaceholderService(): void {
		const placeholderHelper = new PlaceholderServiceHelper();
		const placeholderService = new PlaceholderService(placeholderHelper);
		placeholderService.init();
	}
}
