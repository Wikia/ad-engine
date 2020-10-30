import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	btfBlockerService,
	context,
	DiProcess,
	events,
	eventService,
	fillerService,
	PorvataFiller,
	SlotCreator,
	slotService,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	SlotSetupDefinition,
	UcpMobileSlotsDefinitionRepository,
} from './ucp-mobile-slots-definition-repository';

@Injectable()
export class UcpMobileDynamicSlotsSetup implements DiProcess {
	private CODE_PRIORITY = {
		floor_adhesion: {
			active: false,
		},
	};

	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: UcpMobileSlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureAffiliateSlot();
		this.configureIncontentPlayer();
		this.registerFloorAdhesionCodePriority();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		this.insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
		]);

		if (!topLeaderboardDefinition) {
			eventService.once(events.AD_STACK_START, () => btfBlockerService.finishFirstCall());
		}
	}

	private insertSlots(slotsToInsert: SlotSetupDefinition[]): void {
		slotsToInsert
			.filter((config) => !!config)
			.forEach(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
				try {
					this.slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
					if (activator) {
						activator();
					}
				} catch (e) {
					slotsContext.setState(slotCreatorConfig.slotName, false);
				}
			});
	}

	private configureAffiliateSlot(): void {
		const slotName = 'affiliate_slot';
		const isApplicable =
			context.get('wiki.opts.enableAffiliateSlot') && !context.get('custom.hasFeaturedVideo');

		if (isApplicable) {
			slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
				templateService.init('affiliateDisclaimer', slotService.get(slotName));
			});
		} else {
			slotService.disable(slotName);
		}
	}

	private configureIncontentPlayer(): void {
		const icpSlotName = 'incontent_player';

		slotService.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, {});

		fillerService.register(new PorvataFiller());
	}

	private registerFloorAdhesionCodePriority(): void {
		slotService.on('floor_adhesion', AdSlot.STATUS_SUCCESS, () => {
			this.CODE_PRIORITY.floor_adhesion.active = true;

			eventService.on(events.VIDEO_AD_IMPRESSION, () => {
				if (this.CODE_PRIORITY.floor_adhesion.active) {
					this.CODE_PRIORITY.floor_adhesion.active = false;
					slotService.disable('floor_adhesion', 'closed-by-porvata');
				}
			});
		});

		slotService.on('floor_adhesion', AdSlot.HIDDEN_EVENT, () => {
			this.CODE_PRIORITY.floor_adhesion.active = false;
		});
	}
}
