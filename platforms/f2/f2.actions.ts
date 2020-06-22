import { globalAction } from '@wikia/ad-engine';
import { props } from 'ts-action';

export const f2FeedInsertTopBoxad = globalAction(
	'[F2 Feed] Insert Top Boxad',
	props<{ hasRightRail: boolean }>(),
);

export const f2FeedInsertFeedBoxad = globalAction(
	'[F2 Feed] Insert Feed Boxad',
	props<{ hasRightRail: boolean }>(),
);

export const f2ArticleInsertTopBoxad = globalAction(
	'[F2 Article] Insert Top Boxad',
	props<{ hasRightRail: boolean; hasVideo: boolean }>(),
);

export const f2ArticleInsertFeedBoxad = globalAction(
	'[F2 Article] Insert Feed Boxad',
	props<{ hasRightRail: boolean }>(),
);

export const f2ArticleInsertIncontentBoxad = globalAction('[F2 Article] Insert Incontent Boxad');
