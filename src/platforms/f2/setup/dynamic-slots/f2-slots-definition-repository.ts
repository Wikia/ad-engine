import { SlotSetupDefinition } from '@platforms/shared';
import {
	AdSlotEvent,
	communicationService,
	context,
	eventsRepository,
	InstantConfigService,
	scrollListener,
	SlotCreatorWrapperConfig,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2Environment, F2_ENV } from '../../setup-f2';
import { F2State } from '../../utils/f2-state';
import { F2_STATE } from '../../utils/f2-state-binder';

@Injectable()
export class F2SlotsDefinitionRepository {
	private get isArticle(): boolean {
		return this.f2State.pageType === 'article';
	}

	constructor(
		@Inject(F2_STATE) private f2State: F2State,
		@Inject(F2_ENV) private f2Env: F2Environment,
		protected instantConfig: InstantConfigService,
	) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		if (!['article', 'home', 'topic'].includes(this.f2State.pageType)) {
			return;
		}

		if (this.f2State.hasFeaturedVideo) {
			return;
		}

		const slotName = 'top_leaderboard';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.top-leaderboard',
				insertMethod: 'prepend',
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
								AdSlotEvent.CUSTOM_EVENT,
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

	getTopBoxadConfig(): SlotSetupDefinition {
		const slotName = 'top_boxad';
		const slotCreatorWrapperConfig: SlotCreatorWrapperConfig = {
			classList: ['article-layout__top-box-ad'],
		};
		const activator = () => context.push('state.adStack', { id: slotName });

		if (!this.isArticle) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-section__ad,.feed-layout__right-rail',
					insertMethod: 'prepend',
					classList: ['hide'],
				},
			};
		}

		if (this.f2Env.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.article-layout__rail',
					insertMethod: 'prepend',
					classList: ['hide'],
				},
			};
		}

		if (this.f2State.hasFeaturedVideo) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.article-layout__content',
					insertMethod: 'append',
					classList: ['hide'],
				},
			};
		}

		return {
			activator,
			slotCreatorWrapperConfig,
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.article-content.entry-content p:first-child',
				insertMethod: 'after',
				classList: ['hide'],
			},
		};
	}

	getIncontentBoxadConfig(): SlotSetupDefinition {
		const slotName = 'incontent_boxad';

		if (!this.isArticle) {
			return;
		}

		if (!this.isArticleLongEnoughForIncontentBoxad()) {
			return;
		}

		return {
			activator: () => context.push('events.pushOnScroll.ids', slotName),
			slotCreatorWrapperConfig: {
				classList: ['article-layout__incontent-ad'],
			},
			slotCreatorConfig: {
				slotName,
				anchorPosition: 2,
				anchorSelector: '.article-content h2, .article-content h3',
				insertMethod: 'before',
				classList: ['hide'],
			},
		};
	}

	getBottomLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'bottom_leaderboard';
		const activator = () => context.push('events.pushOnScroll.ids', slotName);
		const slotCreatorWrapperConfig: SlotCreatorWrapperConfig = {
			classList: ['bottom-leaderboard-wrapper'],
		};

		if (!this.isArticle) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.search-box-bottom-wrapper,.wds-global-footer',
					insertMethod: 'before',
					classList: ['hide'],
				},
			};
		}

		return {
			activator,
			slotCreatorWrapperConfig,
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.article-layout-wrapper',
				insertMethod: 'after',
				classList: ['hide'],
			},
		};
	}

	private isArticleLongEnoughForIncontentBoxad(): boolean {
		// Sync this with &.has-incontent-ad height in article/layout.css
		const longArticleMinHeight = 2200; // Two ads 1050px tall + some space between them
		const selectedHeader = document.querySelectorAll('.article-content h2, .article-content h3')[2];
		const articleContent: HTMLDivElement = document.querySelector('.article-content');
		const articleContentHeight = articleContent.offsetHeight;

		return selectedHeader && articleContentHeight > longArticleMinHeight;
	}
}
