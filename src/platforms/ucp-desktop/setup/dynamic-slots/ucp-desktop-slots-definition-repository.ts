import { SlotSetupDefinition } from '@platforms/shared';
import {
	btRec,
	communicationService,
	context,
	eventsRepository,
	InstantConfigService,
	scrollListener,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { FmrRotator } from '../../utils/fmr-rotator';

@Injectable()
export class UcpDesktopSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'top_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.top-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		if (!this.isRightRailApplicable()) {
			return;
		}

		const slotName = 'top_boxad';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.main-page-tag-rcs, #rail-boxad-wrapper',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isIncontentLeaderboardApplicable(): boolean {
		const icLbMaxWidth = 768;
		const pageContentSelector = 'main.page__main #content';

		return utils.getWidth(document.querySelector(pageContentSelector)) >= icLbMaxWidth;
	}

	getIncontentLeaderboardConfig(): SlotSetupDefinition {
		if (!this.isIncontentLeaderboardApplicable()) {
			return;
		}

		const slotName = 'incontent_leaderboard';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: context.get('templates.incontentAnchorSelector'),
				anchorPosition: 'belowFirstViewport',
				avoidConflictWith: ['.incontent-leaderboard', '#incontent_player'],
				insertMethod: 'before',
				classList: ['hide', 'ad-slot', 'incontent-leaderboard'],
				repeat: {
					index: 1,
					limit: 20,
					slotNamePattern: `${slotName}_{slotConfig.repeat.index}`,
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
						'targeting.pos': [slotName],
					},
				},
			},
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
			},
		};
	}

	getIncontentBoxadConfig(): SlotSetupDefinition {
		if (!this.isRightRailApplicable()) {
			return;
		}

		const slotNamePrefix = 'incontent_boxad_';
		const slotName = `${slotNamePrefix}1`;

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#WikiaAdInContentPlaceHolder',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
				repeat: {
					index: 1,
					limit: 20,
					slotNamePattern: `${slotNamePrefix}{slotConfig.repeat.index}`,
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
						'targeting.pos': ['incontent_boxad'],
					},
					disablePushOnScroll: true,
				},
			},
			activator: () => {
				const rotator = new FmrRotator(slotName, slotNamePrefix, btRec);

				communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
					rotator.rotateSlot();
				});
			},
		};
	}

	private isRightRailApplicable(rightRailBreakingPoint = 1024): boolean {
		return utils.getViewportWidth() >= rightRailBreakingPoint;
	}

	getBottomLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'bottom_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.bottom-leaderboard',
				insertMethod: 'prepend',
				classList: ['ad-slot'],
			},
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
			},
		};
	}

	getIncontentPlayerConfig(): SlotSetupDefinition {
		const slotName = 'incontent_player';

		if (!this.isIncontentPlayerApplicable()) {
			return;
		}

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: context.get('templates.incontentAnchorSelector'),
				anchorPosition: 'belowFirstViewport',
				avoidConflictWith: ['.incontent-leaderboard'],
				insertMethod: 'before',
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isIncontentPlayerApplicable(): boolean {
		return context.get('custom.hasIncontentPlayer');
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
				const numberOfViewportsFromTopToPush: number =
					this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

				if (numberOfViewportsFromTopToPush === -1) {
					context.push('state.adStack', { id: slotName });
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
