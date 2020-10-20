import { slotsContext } from '@platforms/shared';
import {
	btfBlockerService,
	context,
	DiProcess,
	events,
	eventService,
	fillerService,
	PorvataFiller,
	SlotCreator,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	SlotSetupDefinition,
	UcpMercurySlotsDefinitionRepository,
} from './ucp-mercury-slots-definition-repository';

@Injectable()
export class UcpMercuryDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: UcpMercurySlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureIncontentPlayer();
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

	private configureIncontentPlayer(): void {
		const icpSlotName = 'incontent_player';

		slotService.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, {});

		fillerService.register(new PorvataFiller());
	}
}
