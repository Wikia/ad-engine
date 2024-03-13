import { SlotsDefinitionRepository, SlotSetupDefinition } from '@platforms/shared';
import {
	AdSlot,
	btRec,
	communicationService,
	context,
	eventsRepository,
	InstantConfigService,
	RepeatableSlotPlaceholderConfig,
	slotPlaceholderInjector,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { FmrRotator } from '../../utils/fmr-rotator';

@Injectable()
export class UcpDesktopSlotsDefinitionRepository implements SlotsDefinitionRepository {
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getGalleryLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'gallery_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.gallery-leaderboard',
				insertMethod: 'prepend',
				classList: ['ad-slot'],
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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
		const anchorSelector = this.isIncontentPlayerApplicable()
			? context.get('templates.incontentAnchorSelector').replace(/h([2-5])/gi, 'h$1:nth-of-type(2)')
			: context.get('templates.incontentAnchorSelector');
		const slotConfig: SlotSetupDefinition = {
			slotCreatorConfig: {
				slotName,
				placeholderConfig: {
					createLabel: true,
				},
				anchorSelector,
				anchorPosition: 'belowFirstViewport',
				avoidConflictWith: ['.ad-slot-icl'],
				insertMethod: 'before',
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot', 'ad-slot-icl'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-placeholder', 'incontent-leaderboard', 'is-loading'],
			},
			activator: () => {
				communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, () => {
					context.push('events.pushOnScroll.ids', slotName);
				});
			},
		};

		if (context.get('templates.incontentHeadersExperiment')) {
			slotConfig.slotCreatorConfig.repeat = {
				index: 1,
				limit: 20,
				slotNamePattern: `${slotName}_{slotConfig.repeat.index}`,
				updateProperties: {
					adProduct: '{slotConfig.slotName}',
					'targeting.rv': '{slotConfig.repeat.index}',
					'targeting.pos': [slotName],
				},
				updateCreator: {
					anchorSelector: '.incontent-leaderboard',
					avoidConflictWith: ['.ad-slot-icl', '#incontent_player'],
					insertMethod: 'append',
					placeholderConfig: {
						createLabel: false,
					},
				},
			};
			slotConfig.activator = () => {
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => {
						context.push('events.pushOnScroll.ids', slotName);
						if (!action.isLoaded) {
							this.injectIncontentAdsPlaceholders();
						}
					},
				);
			};
		}

		return slotConfig;
	}

	private injectIncontentAdsPlaceholders(): void {
		const adSlotCategory = 'incontent';

		const iclPlaceholderConfig: RepeatableSlotPlaceholderConfig = {
			classList: ['ad-slot-placeholder', 'incontent-leaderboard', 'is-loading'],
			anchorSelector: context.get('templates.incontentAnchorSelector'),
			avoidConflictWith: ['.ad-slot-placeholder', '.incontent-leaderboard', '#incontent_player'],
			insertMethod: 'before',
			repeatStart: 1,
			repeatLimit: 19,
		};

		slotPlaceholderInjector.injectAndRepeat(iclPlaceholderConfig, adSlotCategory);
	}

	getIncontentBoxadConfig(): SlotSetupDefinition {
		if (!this.isRightRailApplicable()) {
			return;
		}

		const slotNamePrefix = 'incontent_boxad_';
		const slotName = `${slotNamePrefix}1`;
		const bidGroup = 'incontent_boxad';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#WikiaAdInContentPlaceHolder',
				insertMethod: 'append',
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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
				communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
					if (this.isFmrApplicable(slotName)) {
						const rotator = new FmrRotator(slotName, slotNamePrefix, btRec, {
							topPositionToRun: 65,
							bidders: {
								bidGroup: bidGroup,
								a9Alias: slotName,
								bidderAlias: slotName,
							},
						});
						rotator.rotateSlot();
					} else {
						utils.logger('ad-engine', 'ICB disabled');
					}
				});
			},
		};
	}

	private isFmrApplicable(slotName: string): boolean {
		const fmrRecirculationElement = document.querySelector(
			context.get(`slots.${slotName}.recirculationElementSelector`),
		);
		if (fmrRecirculationElement === null) {
			return false;
		}
		const displayValue = window.getComputedStyle(fmrRecirculationElement, null).display;
		return displayValue !== 'none';
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
			},
		};
	}

	private isFloorAdhesionApplicable(): boolean {
		return !context.get('custom.hasFeaturedVideo');
	}
}
