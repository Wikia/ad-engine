import { DynamicSlotsSetup } from '@platforms/shared';
import { communicationService, context, ofType } from '@wikia/ad-engine';
import { tap } from 'rxjs/operators';
import {
	f2ArticleInsertFeedBoxad,
	f2ArticleInsertIncontentBoxad,
	f2ArticleInsertTopBoxad,
	f2FeedInsertFeedBoxad,
	f2FeedInsertTopBoxad,
} from '../../f2.actions';

export class F2DynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.handleSlotsInjection();
		this.configureTopLeaderboard();
	}

	private handleSlotsInjection(): void {
		communicationService.action$
			.pipe(
				ofType(f2FeedInsertTopBoxad),
				tap(({ hasRightRail }) => {
					const topBoxad = this.makeSlot('top_boxad', 'feed-block-ad feed-top-boxad');

					if (hasRightRail) {
						document.querySelectorAll('.feed-layout__right-rail')[0]?.prepend(topBoxad);
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
				tap(({ hasRightRail }) => {
					const feedBoxad = this.makeSlot('feed_boxad', 'feed-block-ad feed-bottom-boxad');

					if (hasRightRail) {
						document.querySelectorAll('.feed-layout .feed-item')[10]?.before(feedBoxad);
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
				tap(({ hasRightRail, hadVideo }) => {
					const topBoxad = this.makeSlot('top_boxad', 'article-layout__top-box-ad');

					if (hasRightRail) {
						document.querySelectorAll('.article-layout__rail')[0]?.prepend(topBoxad);
					} else if (hadVideo) {
						document.querySelectorAll('.article-layout__content')[0]?.append(topBoxad);
					} else {
						document
							.querySelectorAll('.article-content.entry-content p:first-child')[0]
							?.after(topBoxad);
					}

					context.push('state.adStack', { id: 'top_boxad' });
				}),
			)
			.subscribe();

		communicationService.action$
			.pipe(
				ofType(f2ArticleInsertFeedBoxad),
				tap(({ hasRightRail }) => {
					const feedBoxad = this.makeSlot('feed_boxad', 'feed-block-ad feed-boxad');

					if (hasRightRail) {
						document.querySelectorAll('.featured-block.in-area-right')[0]?.before(feedBoxad);
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

	private makeSlot(slotName, wrapperClass = ''): string {
		return `<div class="${wrapperClass}"><div class="gpt-ad" id="${slotName}"></div></div>`;
	}

	private configureTopLeaderboard(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.set('templates.stickyTlb.enabled', true);
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
		context.set('templates.stickyTLB.enabled', true);
	}
}
