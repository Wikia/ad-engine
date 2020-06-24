import { DynamicSlotsSetup } from '@platforms/shared';
import {
	communicationService,
	context,
	ofType,
	SlotCreator,
	SlotCreatorConfig,
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
					const config: SlotCreatorConfig = {
						slotName: 'top_boxad',
						wrapperClasses: ['feed-block-ad', 'feed-top-boxad'],
						refSelectors: hasRightRail ? '.feed-layout__right-rail' : '.feed-layout .feed-item',
						refIndex: hasRightRail ? 0 : 1,
						insertMethod: 'prepend',
					};

					this.slotCreator.createSlot(config);
					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2FeedInsertFeedBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const config: SlotCreatorConfig = {
						slotName: 'feed_boxad',
						wrapperClasses: ['feed-block-ad', 'feed-bottom-boxad'],
						refSelectors: '.feed-layout .feed-item',
						refIndex: hasRightRail ? 10 : 6,
						insertMethod: hasRightRail ? 'before' : 'prepend',
					};

					this.slotCreator.createSlot(config);
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
					const config: SlotCreatorConfig = {
						slotName: 'top_boxad',
						wrapperClasses: ['article-layout__top-box-ad'],
						refSelectors: '',
						insertMethod: '' as any,
					};

					if (hasRightRail) {
						config.refSelectors = '.article-layout__rail';
						config.insertMethod = 'prepend';
					} else if (hasVideo) {
						config.refSelectors = '.article-layout__content';
						config.insertMethod = 'append';
					} else {
						config.refSelectors = '.article-content.entry-content p:first-child';
						config.insertMethod = 'after';
					}

					this.slotCreator.createSlot(config);
					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertFeedBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const config: SlotCreatorConfig = {
						slotName: 'feed_boxad',
						wrapperClasses: ['feed-block-ad', 'feed-boxad'],
						refSelectors: hasRightRail
							? '.featured-block.in-area-right'
							: '.feed-layout__container .feed-item',
						refIndex: hasRightRail ? 0 : 3,
						insertMethod: 'before',
					};

					this.slotCreator.createSlot(config);
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
						wrapperClasses: ['article-layout__incontent-ad'],
						refSelectors: '.article-content h2, .article-content h3',
						refIndex: 2,
						insertMethod: 'before',
					};

					this.slotCreator.createSlot(config);
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
