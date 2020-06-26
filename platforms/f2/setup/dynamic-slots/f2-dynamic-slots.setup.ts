import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import {
	communicationService,
	context,
	ofType,
	SlotCreator,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { take, tap } from 'rxjs/operators';
import { f2ArticleFeedLoaded, f2FeedLoaded } from '../../f2.actions';
import { F2_ENV, F2Environment } from '../../setup-f2';
import { F2State } from '../../utils/f2-state';
import { F2_STATE } from '../../utils/f2-state-binder';
import { F2FeedBoxadStickiness } from './f2-feed-boxad-stickiness';

interface SlotConfig {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class F2DynamicSlotsSetup implements DynamicSlotsSetup {
	private readonly isArticle: boolean;
	private readonly isHome: boolean;
	private readonly isTopic: boolean;
	private readonly hasRightRail: boolean;
	private readonly hasFeaturedVideo: boolean;

	constructor(
		@Inject(F2_STATE) private f2State: F2State,
		@Inject(F2_ENV) private f2Env: F2Environment,
		private f2FeedBoxadStickiness: F2FeedBoxadStickiness,
		private slotCreator: SlotCreator,
	) {
		this.isArticle = this.f2State.pageType === 'article';
		this.isHome = this.f2State.pageType === 'home';
		this.isTopic = this.f2State.pageType === 'topic';
		this.hasRightRail = this.f2Env.hasRightRail;
		this.hasFeaturedVideo = this.f2State.hasFeaturedVideo;
	}

	configureDynamicSlots(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
	}

	private injectSlots(): void {
		this.insertSlots([
			this.getTopLeaderboardConfig(),
			// FIXME: incontent_boxad
			// Currently right rail does not work properly on production.
			// There is no way to test it.
		]);

		communicationService.action$
			.pipe(
				ofType(f2ArticleFeedLoaded, f2FeedLoaded),
				take(1),
				tap(() => {
					this.insertSlots([
						this.getTopBoxadConfig(),
						this.getBottomLeaderboardConfig(),
						this.getFeedBoxadConfig(),
					]);
				}),
			)
			.subscribe();
	}

	private getTopLeaderboardConfig(): SlotConfig {
		if (!this.isArticle && !this.isHome && !this.isTopic) {
			return;
		}

		if (this.hasFeaturedVideo) {
			return;
		}

		const slotName = 'top_leaderboard';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'prepend',
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private getBottomLeaderboardConfig(): SlotConfig {
		const slotName = 'bottom_leaderboard';
		const activator = () => context.push('events.pushOnScroll.ids', slotName);
		const slotCreatorWrapperConfig = {
			classes: ['bottom-leaderboard-wrapper'],
		};

		if (!this.isArticle) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout .feed-item',
					anchorPosition: 10,
					insertMethod: 'before',
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
			},
		};
	}

	private getTopBoxadConfig(): SlotConfig {
		const slotName = 'top_boxad';
		const slotCreatorWrapperConfig = {
			classes: ['article-layout__top-box-ad'],
		};
		const activator = () => context.push('state.adStack', { id: slotName });

		if (!this.isArticle && this.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout__right-rail',
					insertMethod: 'prepend',
				},
			};
		}

		if (!this.isArticle && !this.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout .feed-item',
					anchorPosition: 1,
					insertMethod: 'before',
				},
			};
		}

		if (this.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.article-layout__rail',
					insertMethod: 'prepend',
				},
			};
		}

		if (this.hasFeaturedVideo) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.article-layout__content',
					insertMethod: 'append',
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
			},
		};
	}

	private getFeedBoxadConfig(): SlotConfig {
		const slotName = 'feed_boxad';
		const slotCreatorWrapperConfig = {
			classes: ['feed-block-ad', 'feed-bottom-boxad'],
		};
		const activator = () => {
			context.push('events.pushOnScroll.ids', slotName);
			if (this.hasRightRail) {
				this.f2FeedBoxadStickiness.initializeFeedBoxadStickiness();
			}
		};

		if (!this.isArticle && this.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout .feed-item',
					anchorPosition: 10,
					insertMethod: 'before',
				},
			};
		}

		if (!this.isArticle && !this.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout .feed-item',
					anchorPosition: 6,
					insertMethod: 'before',
				},
			};
		}

		if (this.hasRightRail) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.featured-block.in-area-right',
					insertMethod: 'before',
				},
			};
		}

		return {
			activator,
			slotCreatorWrapperConfig,
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.feed-layout__container .feed-item',
				anchorPosition: 3,
				insertMethod: 'before',
			},
		};
	}

	private insertSlots(slotsToInsert: SlotConfig[]): void {
		slotsToInsert
			.filter((config) => !!config)
			.forEach(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
				try {
					this.slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
					if (activator) {
						activator();
					}
				} catch (e) {
					slotsContext.setState(slotCreatorConfig.slotName, false);
				}
			});
	}

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.set('templates.stickyTlb.enabled', true);
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
		context.set('templates.stickyTLB.enabled', true);
	}
}
