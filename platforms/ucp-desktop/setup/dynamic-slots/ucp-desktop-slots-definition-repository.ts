import { fanFeedNativeAdListener, SlotSetupDefinition } from '@platforms/shared';
import {
	btRec,
	communicationService,
	context,
	DomListener,
	eventsRepository,
	FmrRotator,
	InstantConfigService,
	scrollListener,
	UapLoadStatus,
	utils,
	nativoLazyLoader,
	Nativo,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsDefinitionRepository {
	constructor(
		protected instantConfig: InstantConfigService,
		protected domListener: DomListener,
		protected nativo: Nativo,
	) {}

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
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
				repeat: {
					additionalClasses: 'hide',
					index: 1,
					limit: 20,
					slotNamePattern: `${slotNamePrefix}{slotConfig.repeat.index}`,
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
					},
					insertBelowScrollPosition: false,
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
		if (!this.isIncontentPlayerApplicable()) {
			return;
		}
		const slotName = 'incontent_player';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: context.get(`slots.${slotName}.insertBeforeSelector`),
				anchorPosition: 'belowFirstViewport',
				insertMethod: 'before',
			},
			activator: () => {
				if (
					context.get('services.distroScale.enabled') ||
					context.get('services.exCo.enabled') ||
					context.get('services.anyclip.enabled') ||
					context.get('services.connatix.enabled')
				) {
					context.push('state.adStack', { id: slotName });
				} else {
					context.push('events.pushOnScroll.ids', slotName);
				}
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

	getInvisibleHighImpactConfig(): SlotSetupDefinition {
		if (!this.isInvisibleHighImpactApplicable()) {
			return;
		}

		const slotName = 'invisible_high_impact_2';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.page',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isInvisibleHighImpactApplicable(): boolean {
		return !this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo');
	}

	getNativoIncontentAdConfig(): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}
		const slotName = 'ntv_ad';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > h2:nth-of-type(2)',
				insertMethod: 'before',
				classList: ['ntv-ad', 'ad-slot'],
			},
			activator: () => {
				const scrollThreshold = context.get('events.pushOnScroll.nativoThreshold') || 200;

				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) =>
						nativoLazyLoader.scrollTrigger(slotName, scrollThreshold, this.domListener, () => {
							if (
								!action.isLoaded ||
								action.adProduct !== 'ruap' ||
								!context.get('custom.hasFeaturedVideo')
							) {
								context.push('state.adStack', { id: slotName });
							}
						}),
				);
			},
		};
	}

	getNativoFeedAdConfig(): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}
		const slotName = 'ntv_feed_ad';

		return {
			activator: () => {
				fanFeedNativeAdListener(() => context.push('state.adStack', { id: slotName }));
			},
		};
	}
}
