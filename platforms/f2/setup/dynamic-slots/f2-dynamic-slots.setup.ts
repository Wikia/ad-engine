import { DynamicSlotsSetup } from '@platforms/shared';
import {
	communicationService,
	context,
	ofType,
	SlotCreator,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take, tap } from 'rxjs/operators';
import {
	f2ArticleInsertFeedBoxad,
	f2ArticleInsertIncontentBoxad,
	f2ArticleInsertTopBoxad,
	f2FeedInsertFeedBoxad,
	f2FeedInsertTopBoxad,
} from '../../f2.actions';
import { F2FeedBoxadStickiness } from './f2-feed-boxad-stickiness';

@Injectable()
export class F2DynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(
		private f2FeedBoxadStickiness: F2FeedBoxadStickiness,
		private slotCreator: SlotCreator,
	) {}

	configureDynamicSlots(): void {
		this.handleSlotsInjection();
		this.configureTopLeaderboard();
	}

	private handleSlotsInjection(): void {
		communicationService.action$
			.pipe(
				ofType(f2FeedInsertTopBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const slotConfig: SlotCreatorConfig = {
						slotName: 'top_boxad',
						anchorSelector: hasRightRail ? '.feed-layout__right-rail' : '.feed-layout .feed-item',
						anchorPosition: hasRightRail ? 0 : 1,
						insertMethod: 'prepend',
					};
					const wrapperConfig: SlotCreatorWrapperConfig = {
						classes: ['feed-block-ad', 'feed-top-boxad'],
					};

					this.slotCreator.createSlot(slotConfig, wrapperConfig);
					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2FeedInsertFeedBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const slotConfig: SlotCreatorConfig = {
						slotName: 'feed_boxad',
						anchorSelector: '.feed-layout .feed-item',
						anchorPosition: hasRightRail ? 10 : 6,
						insertMethod: hasRightRail ? 'before' : 'prepend',
					};
					const wrapperConfig: SlotCreatorWrapperConfig = {
						classes: ['feed-block-ad', 'feed-bottom-boxad'],
					};

					this.slotCreator.createSlot(slotConfig, wrapperConfig);
					if (hasRightRail) {
						this.f2FeedBoxadStickiness.initializeFeedBoxadStickiness();
					}
					context.push('events.pushOnScroll.ids', 'feed_boxad');
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertTopBoxad),
				take(1),
				tap(({ hasRightRail, hasVideo }) => {
					const slotConfig: SlotCreatorConfig = {
						slotName: 'top_boxad',
						anchorSelector: '',
						insertMethod: '' as any,
					};
					const wrapperConfig: SlotCreatorWrapperConfig = {
						classes: ['article-layout__top-box-ad'],
					};

					if (hasRightRail) {
						slotConfig.anchorSelector = '.article-layout__rail';
						slotConfig.insertMethod = 'prepend';
					} else if (hasVideo) {
						slotConfig.anchorSelector = '.article-layout__content';
						slotConfig.insertMethod = 'append';
					} else {
						slotConfig.anchorSelector = '.article-content.entry-content p:first-child';
						slotConfig.insertMethod = 'after';
					}

					this.slotCreator.createSlot(slotConfig, wrapperConfig);
					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertFeedBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const slotConfig: SlotCreatorConfig = {
						slotName: 'feed_boxad',
						anchorSelector: hasRightRail
							? '.featured-block.in-area-right'
							: '.feed-layout__container .feed-item',
						anchorPosition: hasRightRail ? 0 : 3,
						insertMethod: 'before',
					};
					const wrapperConfig: SlotCreatorWrapperConfig = {
						classes: ['feed-block-ad', 'feed-boxad'],
					};

					this.slotCreator.createSlot(slotConfig, wrapperConfig);
					context.push('events.pushOnScroll.ids', 'feed_boxad');
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertIncontentBoxad),
				take(1),
				tap(() => {
					const config: SlotCreatorConfig = {
						slotName: 'incontent_boxad',
						anchorSelector: '.article-content h2, .article-content h3',
						anchorPosition: 2,
						insertMethod: 'before',
					};
					const wrapperConfig = {
						classes: ['article-layout__incontent-ad'],
					};

					this.slotCreator.createSlot(config, wrapperConfig);
					document.querySelector('.article-layout__rail').classList.add('has-incontent-ad');
					context.push('events.pushOnScroll.ids', 'incontent_boxad');
				}),
			)
			.subscribe();
	}

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.set('templates.stickyTlb.enabled', true);
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
		context.set('templates.stickyTLB.enabled', true);
	}
}
