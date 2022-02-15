import { insertSlots, PlaceholderService } from '@platforms/shared';
import {
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { F2SlotsDefinitionRepository } from './f2-slots-definition-repository';

@Injectable()
export class F2DynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: F2SlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
		this.registerAdPlaceholderService();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
		]);

		if (!topLeaderboardDefinition) {
			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
					isLoaded: universalAdPackage.isFanTakeoverLoaded(),
					adProduct: universalAdPackage.getType(),
				});
			});
		}
	}

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo')) {
			if (
				context.get('templates.stickyTlb.forced') ||
				context.get('templates.stickyTlb.lineItemIds')
			) {
				context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
			}
		}
	}

	private registerAdPlaceholderService(): void {
		const placeholderService = new PlaceholderService();
		placeholderService.init();
	}
}
