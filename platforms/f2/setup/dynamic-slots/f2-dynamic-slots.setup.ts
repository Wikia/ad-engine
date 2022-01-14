import { slotsContext } from '@platforms/shared';
import {
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	events,
	SlotCreator,
	uapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { F2SlotsDefinitionRepository, SlotSetupDefinition } from './f2-slots-definition-repository';

@Injectable()
export class F2DynamicSlotsSetup implements DiProcess {
	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: F2SlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		this.insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
		]);

		if (!topLeaderboardDefinition) {
			utils.listener(events.AD_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.dispatch(
					uapLoadStatus({
						isLoaded: universalAdPackage.isFanTakeoverLoaded(),
						adProduct: universalAdPackage.getType(),
					}),
				);
			});
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

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
	}
}
