import { context, Targeting, utils } from '@wikia/ad-engine';

import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { getDomain } from '../../../../utils/get-domain';
import { getMediaWikiVariable } from '../../../../utils/get-media-wiki-variable';
import { FandomContext, Page, Site } from '../models/fandom-context';
import { CommonStrategyParams } from '../interfaces/common-strategy-params';
import { OptionalStrategyParams } from '../interfaces/optional-strategy-params';

export abstract class CommonStrategy {
	protected getCommonParams(
		fandomContext: FandomContext,
		wiki: MediaWikiAdsContext,
		skin: string,
	): Partial<Targeting> {
		const domain = getDomain();

		const commonParams: Partial<Targeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			dmn: domain.base,
			geo: utils.geoService.getCountryCode() || 'none',
			hostpre: utils.targeting.getHostnamePrefix(),
			original_host: wiki.opts?.isGamepedia ? 'gamepedia' : 'fandom',
			skin: skin,
			uap: 'none',
			uap_c: 'none',
			is_mobile: utils.client.isMobileSkin(skin) ? '1' : '0',
		};

		const commonContextParams: CommonStrategyParams = {
			artid: fandomContext.page.articleId ? fandomContext.page.articleId.toString() : '',
			bundles: fandomContext.site.tags?.bundles || [],
			esrb: fandomContext.site.esrbRating || '',
			kid_wiki: fandomContext.site.directedAtChildren ? '1' : '0',
			lang: fandomContext.page.lang || 'unknown',
			s0: fandomContext.site.legacyVertical,
			s0c: fandomContext.site.categories,
			s0v: fandomContext.site.wikiVertical,
			s1: utils.targeting.getRawDbName(fandomContext.site.siteName),
			s2: this.getAdLayout(fandomContext.page.pageType || 'article'),
			wpage: fandomContext.page.pageName && fandomContext.page.pageName.toLowerCase(),
		};

		return {
			...commonParams,
			...commonContextParams,
			...this.getOptionalKeyVals(fandomContext),
		};
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

	protected getTaxonomyTags(contextTags: Site['tags'] | Page['tags']): TaxonomyTags {
		return {
			gnre: contextTags?.gnre || [],
			media: contextTags?.media || [],
			pform: contextTags?.pform || [],
			pub: contextTags?.pub || [],
			theme: contextTags?.theme || [],
			tv: contextTags?.tv || [],
		};
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

	private getOptionalKeyVals(fandomContext: FandomContext): OptionalStrategyParams {
		const keyVals: OptionalStrategyParams = {};

		const keyValsMap = {
			cid: utils.queryString.get('cid'),
			pv: context.get('wiki.pvNumber'),
			pvg: context.get('wiki.pvNumberGlobal'),
		};

		Object.keys(keyValsMap).forEach((key) => {
			if (keyValsMap[key]) {
				keyVals[key] = keyValsMap[key].toString();
			}
		});

		if (fandomContext.site.top1000) {
			keyVals.top = '1k';
		}

		return keyVals;
	}
}
