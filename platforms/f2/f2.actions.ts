import { action, props } from 'ts-action';

export const f2FeedInsertTopBoxad = action(
	'[F2 Feed] Insert Top Boxad',
	props<{ hasRightRail: boolean }>(),
);

export const f2FeedInsertFeedBoxad = action(
	'[F2 Feed] Insert Feed Boxad',
	props<{ hasRightRail: boolean }>(),
);

export const f2ArticleInsertTopBoxad = action(
	'[F2 Article] Insert Top Boxad',
	props<{ hasRightRail: boolean; isVideo: boolean }>(),
);

export const f2ArticleInsertFeedBoxad = action(
	'[F2 Article] Insert Feed Boxad',
	props<{ hasRightRail: boolean }>(),
);

export const f2ArticleInsertIncontentBoxad = action('[F2 Article] Insert Incontent Boxad');
