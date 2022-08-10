import { context, Targeting, utils } from '@wikia/ad-engine';
import { getDomain } from '../../../../utils/get-domain';
import { getMediaWikiVariable } from '../../../../utils/get-media-wiki-variable';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';

export abstract class CommonStrategy {
	protected addCommonParams(
		targeting: Partial<Targeting>,
		wiki: MediaWikiAdsContext,
		skin: string,
	): Partial<Targeting> {
		const domain = getDomain();

		targeting.ar = window.innerWidth > window.innerHeight ? '4:3' : '3:4';
		targeting.dmn = domain.base;
		targeting.geo = utils.geoService.getCountryCode() || 'none';
		targeting.hostpre = utils.targeting.getHostnamePrefix();
		targeting.original_host = wiki.opts?.isGamepedia ? 'gamepedia' : 'fandom';
		// TODO remove, but be careful. According to Sebastian S. this can be removed, but AdEngine will fail to load ads without it.
		targeting.s0v = wiki.targeting.wikiVertical;
		targeting.skin = skin;
		targeting.uap = 'none';
		targeting.uap_c = 'none';
		targeting.is_mobile = utils.client.isMobileSkin(skin) ? '1' : '0';

		this.extendWithOptionalKeyVals(targeting);
		return targeting;
	}

	protected getAdLayout(pageType: string): string {
		const videoStatus = this.getVideoStatus();
		const hasFeaturedVideo = !!videoStatus.hasVideoOnPage;
		const hasIncontentPlayer =
			!hasFeaturedVideo &&
			!!document.querySelector(context.get('slots.incontent_player.insertBeforeSelector'));

		this.updateVideoContext(hasFeaturedVideo, hasIncontentPlayer);

		if (pageType !== 'article') {
			return pageType;
		}

		if (hasFeaturedVideo) {
			const videoPrefix = videoStatus.isDedicatedForArticle ? 'fv' : 'wv';
			return `${videoPrefix}-${pageType}`;
		}

		if (hasIncontentPlayer) {
			return `${pageType}-ic`;
		}

		return pageType;
	}

	protected addPagePrefixToValues(tags: TaxonomyTags): TaxonomyTags {
		for (const [key, value] of Object.entries(tags)) {
			if (Array.isArray(value) && value.length > 0) {
				tags[key] = value.map((val) => 'p_' + val);
			}
		}

		return tags;
	}

	private getVideoStatus(): VideoStatus {
		const featuredVideoData = getMediaWikiVariable('wgArticleFeaturedVideo');
		if (featuredVideoData) {
			// Comparing with false in order to make sure that API already responds with "isDedicatedForArticle" flag
			const isDedicatedForArticle = featuredVideoData.isDedicatedForArticle !== false;
			const bridgeVideoPlayed =
				!isDedicatedForArticle && window.canPlayVideo && window.canPlayVideo();

			return {
				isDedicatedForArticle,
				hasVideoOnPage: isDedicatedForArticle || bridgeVideoPlayed,
			};
		}

		return {};
	}

	// @TODO: This should not be here. It is a side effect that is unpredictable.
	private updateVideoContext(hasFeaturedVideo, hasIncontentPlayer): void {
		context.set('custom.hasFeaturedVideo', hasFeaturedVideo);
		context.set('custom.hasIncontentPlayer', hasIncontentPlayer);
	}

	private extendWithOptionalKeyVals(targeting) {
		const keyValsMap = {
			cid: utils.queryString.get('cid'),
			pv: context.get('wiki.pvNumber'),
			pvg: context.get('wiki.pvNumberGlobal'),
		};

		Object.keys(keyValsMap).forEach((key) => {
			if (keyValsMap[key]) {
				targeting[key] = keyValsMap[key].toString();
			}
		});
	}
}
