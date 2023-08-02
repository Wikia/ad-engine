import { activateFloorAdhesionOnUAP, SlotSetupDefinition } from '@platforms/shared';
import {
	Anyclip,
	communicationService,
	context,
	eventsRepository,
	InstantConfigService,
	scrollListener,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'dynamic-slots';
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
				classList: ['hidden-ad', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getFloorAdhesionConfig(): SlotSetupDefinition {
		const slotName = 'floor_adhesion';

		const activateFloorAdhesion = () => {
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
		};

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'append',
				classList: ['hidden-ad', 'ad-slot'],
			},
			activator: () =>
				activateFloorAdhesionOnUAP(activateFloorAdhesion, !this.isFloorAdhesionNonUapApplicable()),
		};
	}

	private isInterstitialApplicable(): boolean {
		return this.instantConfig.get('icInterstitial') && context.get('state.isMobile');
	}
	private isFloorAdhesionNonUapApplicable(): boolean {
		return (
			context.get('state.isMobile') &&
			!Anyclip.isApplicable() &&
			this.instantConfig.get('icFloorAdhesion')
		);
	}
	getIncontentPlayerConfig(): SlotSetupDefinition | undefined {
		if (!Anyclip.isApplicable()) {
			utils.logger(logGroup, 'Aborting insertion of incontent_player');
			return;
		}

		const slotName = 'incontent_player';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'append',
				classList: ['hidden-ad', 'ad-slot'],
			},
			activator: () => {
				const { dataset } = document.getElementById(slotName);
				dataset.slotLoaded = 'true';
				dataset.ad = slotName;
				context.push('state.adStack', { id: slotName });
			},
		};
	}
}
