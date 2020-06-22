import { DynamicSlotsSetup } from '@platforms/shared';
import { communicationService, context, ofType } from '@wikia/ad-engine';
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
	private domParser = new DOMParser();

	constructor(private f2FeedBoxadStickiness: F2FeedBoxadStickiness) {}

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
					const topBoxad = this.makeSlot('top_boxad', 'feed-block-ad feed-top-boxad');

					if (hasRightRail) {
						document.querySelector('.feed-layout__right-rail')?.prepend(topBoxad);
					} else {
						document.querySelectorAll('.feed-layout .feed-item')[1]?.prepend(topBoxad);
					}

					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2FeedInsertFeedBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const feedBoxad = this.makeSlot('feed_boxad', 'feed-block-ad feed-bottom-boxad');

					if (hasRightRail) {
						document.querySelectorAll('.feed-layout .feed-item')[10]?.before(feedBoxad);
						this.f2FeedBoxadStickiness.initializeFeedBoxadStickiness();
					} else {
						document.querySelectorAll('.feed-layout .feed-item')[6]?.prepend(feedBoxad);
					}

					context.push('events.pushOnScroll.ids', 'feed_boxad');
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertTopBoxad),
				take(1),
				tap(({ hasRightRail, hadVideo }) => {
					const topBoxad = this.makeSlot('top_boxad', 'article-layout__top-box-ad');

					if (hasRightRail) {
						document.querySelector('.article-layout__rail')?.prepend(topBoxad);
					} else if (hadVideo) {
						document.querySelector('.article-layout__content')?.append(topBoxad);
					} else {
						document.querySelector('.article-content.entry-content p:first-child')?.after(topBoxad);
					}

					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertFeedBoxad),
				take(1),
				tap(({ hasRightRail }) => {
					const feedBoxad = this.makeSlot('feed_boxad', 'feed-block-ad feed-boxad');

					if (hasRightRail) {
						document.querySelector('.featured-block.in-area-right')?.before(feedBoxad);
					} else {
						document.querySelectorAll('.feed-layout__container .feed-item')[3]?.before(feedBoxad);
					}

					context.push('events.pushOnScroll.ids', 'feed_boxad');
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertIncontentBoxad),
				take(1),
				tap(() => {
					const incontentBoxad = this.makeSlot('incontent_boxad', 'article-layout__incontent-ad');

					document
						.querySelectorAll('.article-content h2, .article-content h3')[2]
						?.before(incontentBoxad);

					context.push('events.pushOnScroll.ids', 'incontent_boxad');
				}),
			)
			.subscribe();
	}

	private makeSlot(slotName, wrapperClass = ''): ChildNode {
		return this.domParser.parseFromString(
			`<div class="${wrapperClass}"><div class="gpt-ad" id="${slotName}"></div></div>`,
			'text/html',
		).body.firstChild;
	}

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.set('templates.stickyTlb.enabled', true);
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
		context.set('templates.stickyTLB.enabled', true);
	}
}
