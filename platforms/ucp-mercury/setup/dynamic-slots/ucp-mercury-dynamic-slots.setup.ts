import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import { btfBlockerService, events, eventService, SlotCreator } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	SlotSetupDefinition,
	UcpMercurySlotsDefinitionRepository,
} from './ucp-mercury-slots-definition-repository';

@Injectable()
export class UcpMercuryDynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: UcpMercurySlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		this.insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
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
}
