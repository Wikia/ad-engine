import { insertSlots, slotsContext } from '@platforms/shared';
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
		this.configureBottomLeaderboard();
		this.configureIncontentBoxad();
		this.configureIncontentPlayerFiller();
		this.registerFloorAdhesionCodePriority();
		// ToDo: ticket na placeholdery po cleanupie HiViLB
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

	private handleAdPlaceholders(slotName: string, slotStatus: string): void {
		const statusesToHideLabel: string[] = [AdSlot.STATUS_BLOCKED, AdSlot.STATUS_COLLAPSE];
		const statusesToStopLoadingSlot: string[] = [AdSlot.STATUS_SUCCESS];
		const statusesToCollapse: string[] = [AdSlot.STATUS_FORCED_COLLAPSE];
		const adSlot = slotService.get(slotName);

		const placeholder = adSlot.getPlaceholder();
		const adLabelParent = adSlot.getConfigProperty('placeholder')?.adLabelParent;

		if (statusesToStopLoadingSlot.includes(slotStatus)) {
			placeholder?.classList.remove('is-loading');
		} else if (statusesToHideLabel.includes(slotStatus)) {
			placeholder?.classList.remove('is-loading');
			adSlot.getAdLabel(adLabelParent)?.classList.add('hide');
		} else if (statusesToCollapse.includes(slotStatus)) {
			placeholder?.classList.add('hide');
			adSlot.getAdLabel(adLabelParent)?.classList.add('hide');
		}
	}

	private configureTopLeaderboard(): void {
		const slotName = 'top_leaderboard';

		slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_SUCCESS);
		});

		slotService.on(slotName, AdSlot.STATUS_COLLAPSE, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_COLLAPSE);
		});

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

	private configureBottomLeaderboard(): void {
		const slotName = 'bottom_leaderboard';

		slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_SUCCESS);
		});

		slotService.on(slotName, AdSlot.STATUS_BLOCKED, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_BLOCKED);
		});

		slotService.on(slotName, AdSlot.STATUS_COLLAPSE, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_COLLAPSE);
		});

		slotService.on(slotName, AdSlot.STATUS_FORCED_COLLAPSE, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_FORCED_COLLAPSE);
		});
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

	private registerFloorAdhesionCodePriority(): void {
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
}
