import { context, SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../../setup-f2';
import { F2State } from '../../utils/f2-state';
import { F2_STATE } from '../../utils/f2-state-binder';
import { F2FeedBoxadStickiness } from './f2-feed-boxad-stickiness';

export interface SlotSetupDefinition {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class F2SlotsDefinitionRepository {
	private get isArticle(): boolean {
		return this.f2State.pageType === 'article';
	}

	constructor(
		@Inject(F2_STATE) private f2State: F2State,
		@Inject(F2_ENV) private f2Env: F2Environment,
		private f2FeedBoxadStickiness: F2FeedBoxadStickiness,
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
				anchorSelector: 'body',
				insertMethod: 'prepend',
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
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

	getTopBoxadConfig(): SlotSetupDefinition {
		const slotName = 'top_boxad';
		const slotCreatorWrapperConfig: SlotCreatorWrapperConfig = {
			classList: ['article-layout__top-box-ad'],
		};
		const activator = () => context.push('state.adStack', { id: slotName });

		if (!this.isArticle && this.f2Env.hasRightRail) {
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

		if (!this.isArticle && !this.f2Env.hasRightRail) {
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

		if (this.f2Env.hasRightRail) {
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

		if (this.f2State.hasFeaturedVideo) {
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

	getFeedBoxadConfig(): SlotSetupDefinition {
		if (this.isArticle && this.isArticleLongEnoughForIncontentBoxad()) {
			return;
		}

		const slotName = 'feed_boxad';
		const activator = () => {
			context.push('events.pushOnScroll.ids', slotName);
			if (this.f2Env.hasRightRail) {
				this.f2FeedBoxadStickiness.initializeFeedBoxadStickiness();
			}
		};

		if (!this.isArticle && this.f2Env.hasRightRail) {
			return {
				activator,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout .feed-item',
					anchorPosition: 10,
					insertMethod: 'before',
				},
				slotCreatorWrapperConfig: {
					classList: ['feed-block-ad', 'feed-bottom-boxad'],
				},
			};
		}

		if (!this.isArticle && !this.f2Env.hasRightRail) {
			return {
				activator,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.feed-layout .feed-item',
					anchorPosition: 6,
					insertMethod: 'before',
				},
				slotCreatorWrapperConfig: {
					classList: ['feed-block-ad', 'feed-bottom-boxad'],
				},
			};
		}

		if (this.f2Env.hasRightRail) {
			return {
				activator,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.featured-block.in-area-right',
					insertMethod: 'before',
				},
				slotCreatorWrapperConfig: {
					classList: ['feed-block-ad', 'feed-boxad'],
				},
			};
		}

		return {
			activator,
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.feed-layout__container .feed-item',
				anchorPosition: 3,
				insertMethod: 'before',
			},
			slotCreatorWrapperConfig: {
				classList: ['feed-block-ad', 'feed-boxad'],
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
