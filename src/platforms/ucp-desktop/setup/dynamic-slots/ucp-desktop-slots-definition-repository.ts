import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	AdSlotClass,
	context,
	InstantConfigService,
	RepeatableSlotPlaceholderConfig,
	scrollListener,
	slotPlaceholderInjector,
} from '@ad-engine/core';
import { getViewportHeight, getViewportWidth, getWidth } from '@ad-engine/utils';
import {
	activateFloorAdhesionOnUAP,
	SlotsDefinitionRepository,
	SlotSetupDefinition,
} from '@platforms/shared';
import { btRec, Optimizely } from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';
import { BasicRotator } from '../../utils/basic-rotator';
import { FmrRotator } from '../../utils/fmr-rotator';

const OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT = {
	EXPERIMENT_ENABLED: 'anyclip_placement',
	EXPERIMENT_VARIANT: 'anyclip_placement_variant',
};

const OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT_VARIANTS = {
	FEATURED_VIDEO: 'anyclip_placement_featured_video',
	ORIGINAL: 'anyclip_placement_original',
	UNDEFINED: 'anyclip_placement_undefined',
};

@Injectable()
export class UcpDesktopSlotsDefinitionRepository implements SlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService, protected optimizely: Optimizely) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'top_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.top-leaderboard',
				insertMethod: 'prepend',
				classList: [AdSlotClass.HIDDEN_AD_CLASS, 'ad-slot'],
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
				classList: [AdSlotClass.HIDDEN_AD_CLASS, 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isIncontentLeaderboardApplicable(): boolean {
		const icLbMaxWidth = 768;
		const pageContentSelector = 'main.page__main #content';

		return getWidth(document.querySelector(pageContentSelector)) >= icLbMaxWidth;
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
				classList: [AdSlotClass.HIDDEN_AD_CLASS, 'ad-slot', 'ad-slot-icl'],
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

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#WikiaAdInContentPlaceHolder',
				insertMethod: 'append',
				classList: [AdSlotClass.HIDDEN_AD_CLASS, 'ad-slot'],
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
						});
						rotator.rotateSlot();
					} else {
						const rotator = new BasicRotator(slotName, slotNamePrefix, {
							topPositionToRun: 65,
						});

						rotator.rotateSlot();
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
		return getViewportWidth() >= rightRailBreakingPoint;
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

		this.optimizely.addVariantToTargeting(
			OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT,
			OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT_VARIANTS.UNDEFINED,
		);
		const variant = this.optimizely.getVariant(OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT);

		if (variant) {
			this.optimizely.addVariantToTargeting(OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT, variant);
		}

		const isAnyclipInFeaturedVideoPlacement =
			variant === OPTIMIZELY_ANYCLIP_PLACEMENT_EXPERIMENT_VARIANTS.FEATURED_VIDEO;

		return {
			slotCreatorConfig: isAnyclipInFeaturedVideoPlacement
				? {
						slotName,
						anchorSelector: '.page-content',
						avoidConflictWith: ['.incontent-leaderboard'],
						insertMethod: 'before',
						classList: ['anyclip-experiment'],
				  }
				: {
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

		const activateFloorAdhesion = () => {
			const numberOfViewportsFromTopToPush: number =
				this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

			if (numberOfViewportsFromTopToPush === -1) {
				context.push('state.adStack', { id: slotName });
			} else {
				const distance = numberOfViewportsFromTopToPush * getViewportHeight();
				scrollListener.addSlot(slotName, { distanceFromTop: distance });
			}
		};

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.page',
				insertMethod: 'before',
				classList: [AdSlotClass.HIDDEN_AD_CLASS, 'ad-slot'],
			},
			activator: () =>
				activateFloorAdhesionOnUAP(
					activateFloorAdhesion,
					!context.get('options.isFloorAdhesionNonUapApplicable'),
				),
		};
	}

	private isFloorAdhesionApplicable(): boolean {
		return !context.get('custom.hasFeaturedVideo');
	}
}
