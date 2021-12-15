import {
	context,
	InstantConfigService,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

export interface SlotSetupDefinition {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class UcpDesktopSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getBottomLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'bottom_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.bottom-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
			},
		};
	}

	getFloorAdhesionConfig(): SlotSetupDefinition {
		if (!this.isFloorAdhesionApplicable()) {
			return;
		}

		const slotName = 'floor_adhesion';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.page',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				// ToDo: dlaczego na requestly nie dziala?
				context.set(`slots.${slotName}.disabled`, false);

				const numberOfViewportsFromTopToPush: number =
					this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

				if (numberOfViewportsFromTopToPush === -1) {
					context.push('state.adStack', { id: 'floor_adhesion' });
				} else {
					const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
					scrollListener.addSlot(slotName, { distanceFromTop: distance });
				}
			},
		};
	}

	private isFloorAdhesionApplicable(): boolean {
		return this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo');
	}
}
