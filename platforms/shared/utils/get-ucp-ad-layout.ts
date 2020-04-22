import { context } from '@wikia/ad-engine';

export function getUcpAdLayout(targeting: MediaWikiAdsTargeting): string {
	let adLayout = getPageType(targeting);
	const videoStatus = getVideoStatus();
	const hasFeaturedVideo = !!videoStatus.hasVideoOnPage;
	const hasIncontentPlayer =
		!hasFeaturedVideo &&
		document.querySelector(context.get('slots.incontent_player.insertBeforeSelector'));

	if (adLayout === 'article') {
		if (hasFeaturedVideo) {
			const videoPrefix = videoStatus.isDedicatedForArticle ? 'fv' : 'wv';

			adLayout = `${videoPrefix}-${adLayout}`;
		} else if (hasIncontentPlayer) {
			adLayout = `${adLayout}-ic`;
		}
	}

	updateVideoContext(hasFeaturedVideo, hasIncontentPlayer);

	return adLayout;
}

function getPageType(targeting: MediaWikiAdsTargeting): string {
	return targeting.pageType || 'article';
}

function getVideoStatus(): VideoStatus {
	if (context.get('wiki.targeting.hasFeaturedVideo')) {
		// Comparing with false in order to make sure that API already responds with "isDedicatedForArticle" flag
		const isDedicatedForArticle =
			context.get('wiki.targeting.featuredVideo.isDedicatedForArticle') !== false;
		const bridgeVideoPlayed =
			!isDedicatedForArticle && window.canPlayVideo && window.canPlayVideo();

		return {
			isDedicatedForArticle,
			hasVideoOnPage: isDedicatedForArticle || bridgeVideoPlayed,
		};
	}

	return {};
}

// TODO: This should not be here. It is a side effect that is unpredictable.
function updateVideoContext(hasFeaturedVideo, hasIncontentPlayer): void {
	context.set('custom.hasFeaturedVideo', hasFeaturedVideo);
	context.set('custom.hasIncontentPlayer', hasIncontentPlayer);
}
