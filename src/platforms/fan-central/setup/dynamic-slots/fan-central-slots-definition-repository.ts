import { SlotSetupDefinition } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	InsertMethodType,
	InstantConfigService,
	scrollListener,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FanCentralSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'top_leaderboard';
		const [anchorSelector, insertMethod]: [string, InsertMethodType] = context.get('state.isMobile')
			? ['.layoutContainer', 'prepend']
			: ['.layoutContainer div[class^="DefaultLayout"]', 'prepend'];

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector,
				insertMethod,
				classList: ['hide'],
			},
			slotCreatorWrapperConfig: {
				classList: ['tlb-placeholder', 'top-leaderboard'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		const slotName = 'top_boxad';
		const [anchorSelector, insertMethod]: [string, InsertMethodType] = context.get('state.isMobile')
			? ['.layoutContainer main section[class^="Widget"]', 'before']
			: ['.layoutContainer aside[class^="DesktopLayout_rightRail"]', 'prepend'];

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector,
				insertMethod,
				classList: ['hide'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getIncontentNativeConfig(): SlotSetupDefinition {
		const slotName = 'incontent_native';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.layoutContainer main div[class^="FeedCard"]',
				insertMethod: 'after',
				classList: ['hide'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getFloorAdhesionConfig(): SlotSetupDefinition {
		if (!context.get('state.isMobile')) {
			return;
		}

		const slotName = 'floor_adhesion';

		const activateFloorAdhesion = () => {
			const numberOfViewportsFromTopToPush: number =
				this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;
			if (numberOfViewportsFromTopToPush === -1) {
				context.push('state.adStack', { id: slotName });
			} else {
				const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
				scrollListener.addSlot(slotName, { distanceFromTop: distance });
			}
		};

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => {
						if (action.isLoaded) {
							communicationService.onSlotEvent(
								AdSlot.CUSTOM_EVENT,
								({ payload }) => {
									if (
										[
											universalAdPackage.SLOT_UNSTICKED_STATE,
											universalAdPackage.SLOT_FORCE_UNSTICK,
											universalAdPackage.SLOT_STICKY_STATE_SKIPPED,
											universalAdPackage.SLOT_VIDEO_DONE,
										].includes(payload.status)
									) {
										activateFloorAdhesion();
									}
								},
								'top_leaderboard',
							);
						}
					},
				);
			},
		};
	}
}
