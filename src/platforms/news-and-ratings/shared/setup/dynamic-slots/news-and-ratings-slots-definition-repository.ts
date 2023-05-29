import { SlotSetupDefinition } from '@platforms/shared';
import {
	communicationService,
	context,
	eventsRepository,
	InstantConfigService,
	scrollListener,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getInterstitialConfig(): SlotSetupDefinition {
		if (!this.isInterstitialApplicable()) {
			return;
		}

		const slotName = 'interstitial';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
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
				anchorSelector: 'body',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				const numberOfViewportsFromTopToPush: number =
					this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

				if (numberOfViewportsFromTopToPush === -1) {
					context.push('state.adStack', { id: slotName });
				} else {
					communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
						const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
						scrollListener.addSlot(slotName, { distanceFromTop: distance });
					});
				}
			},
		};
	}

	private isFloorAdhesionApplicable(): boolean {
		return this.instantConfig.get('icFloorAdhesion') && !context.get('state.isMobile');
	}

	private isInterstitialApplicable(): boolean {
		return this.instantConfig.get('icInterstitial') && context.get('state.isMobile');
	}
}
