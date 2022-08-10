import { insertSlots, PlaceholderService, slotsContext } from '@platforms/shared';
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
		this.configureTopLeaderboardAndCompanions();
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

		communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () =>
			insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]),
		);

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

	private configureTopLeaderboardAndCompanions(): void {
		if (
			(!context.get('custom.hasFeaturedVideo') || context.get('templates.stickyTlb.withFV')) &&
			(context.get('templates.stickyTlb.forced') || context.get('templates.stickyTlb.lineItemIds'))
		) {
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}

		if (context.get('state.isMobile')) {
			slotsContext.addSlotSize(
				'top_boxad',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
			);
			slotsContext.addSlotSize(
				'incontent_boxad',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
			);
		} else {
			slotsContext.addSlotSize(
				'top_boxad',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
			);

			if (context.get('custom.hasFeaturedVideo')) {
				slotsContext.addSlotSize(
					'incontent_boxad',
					universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
				);
			} else {
				slotsContext.addSlotSize(
					'incontent_boxad',
					universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
				);
			}
		}
	}

	private registerAdPlaceholderService(): void {
		const placeholderService = new PlaceholderService();
		placeholderService.init();
	}
}
