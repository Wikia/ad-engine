import { globalAction } from '@wikia/ad-engine';
import { payload } from 'ts-action';

export const mercuryInit = globalAction('[MobileWiki] Init', payload<MediaWikiAdsContext>());
export const mercuryBeforeTransition = globalAction('[MobileWiki] Before transition');
export const mercuryTransition = globalAction('[MobileWiki] Transition');
export const mercuryAfterTransition = globalAction(
	'[MobileWiki] After transition',
	payload<MediaWikiAdsContext>(),
);
export const mercuryMenuOpen = globalAction('[MobileWiki] Menu open');
