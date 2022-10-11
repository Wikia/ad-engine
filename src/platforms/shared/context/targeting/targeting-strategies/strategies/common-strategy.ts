import { context, Targeting, utils } from '@wikia/ad-engine';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { getDomain } from '../../../../utils/get-domain';
import { getMediaWikiVariable } from '../../../../utils/get-media-wiki-variable';
import { FandomContext } from '../models/fandom-context';
import { CommonStrategyParams } from '../interfaces/common-strategy-params';
import { OptionalStrategyParams } from '../interfaces/optional-strategy-params';
import { TagsType } from '../interfaces/targeting-strategy';

export class CommonStrategy {
	private prefixableKeys = ['gnre', 'media', 'pform', 'pub', 'theme', 'tv'];

	constructor(private skin: string, private fandomContext: FandomContext) {}

	public getCommonParams(): Partial<Targeting> {
		const domain = getDomain();
		const wiki: MediaWikiAdsContext = context.get('wiki');

		const commonParams: Partial<Targeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			dmn: domain.base,
			geo: utils.geoService.getCountryCode() || 'none',
			hostpre: utils.targeting.getHostnamePrefix(),
			original_host: wiki.opts?.isGamepedia ? 'gamepedia' : 'fandom',
			skin: this.skin,
			uap: 'none',
			uap_c: 'none',
			is_mobile: utils.client.isMobileSkin(this.skin) ? '1' : '0',
		};

		const commonContextParams: CommonStrategyParams = {
			artid: this.fandomContext.page.articleId ? this.fandomContext.page.articleId.toString() : '',
			esrb: this.fandomContext.site.esrbRating || '',
			kid_wiki: this.fandomContext.site.directedAtChildren ? '1' : '0',
			lang: this.fandomContext.page.lang || 'unknown',
			// 'this.fandomContext.site.vertical' should be removed after UCP release from ADEN-12194
			s0: this.fandomContext.site.taxonomy?.[0] || this.fandomContext.site.vertical,
			s0c: this.fandomContext.site.categories,
			// 'wiki.targeting.wikiVertical' should be removed after UCP release from ADEN-12194
			s0v: this.fandomContext.site.taxonomy?.[1] || wiki.targeting.wikiVertical,
			s1: utils.targeting.getRawDbName(this.fandomContext.site.siteName),
			s2: this.getAdLayout(this.fandomContext.page.pageType || 'article'),
			wpage: this.fandomContext.page.pageName && this.fandomContext.page.pageName.toLowerCase(),
		};

		return {
			...commonParams,
			...commonContextParams,
			...this.getOptionalKeyVals(),
		};
	}

	private getAdLayout(pageType: string): string {
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

	public getTaxonomyTags(tagsType: TagsType): TaxonomyTags {
		const contextTags =
			tagsType === TagsType.SITE ? this.fandomContext.site.tags : this.fandomContext.page.tags;

		if (!contextTags) {
			utils.warner('Targeting', 'Getting fandomContext tags failed');
			return;
		}

		return {
			age: contextTags.age || [],
			bundles: contextTags.bundles || [],
			gnre: contextTags.gnre || [],
			media: contextTags.media || [],
			pform: contextTags.pform || [],
			pub: contextTags.pub || [],
			sex: contextTags.sex || [],
			theme: contextTags.theme || [],
			tv: contextTags.tv || [],
		};
	}

	public addPagePrefixToValues(tags: TaxonomyTags): TaxonomyTags {
		for (const [key, value] of Object.entries(tags)) {
			if (this.prefixableKeys.includes(key) && Array.isArray(value) && value.length > 0) {
				tags[key] = value.map((val) => 'p_' + val);
			}
		}

		return tags;
	}

	public combinePrefixableTags(siteTags: TaxonomyTags, pageTags: TaxonomyTags): TaxonomyTags {
		const combinedTags: TaxonomyTags = {};

		for (const [key, value] of Object.entries(siteTags)) {
			if (this.prefixableKeys.includes(key) && Array.isArray(value)) {
				if (value.length > 0) {
					combinedTags[key] = siteTags[key].concat(pageTags[key]);
				} else if (value.length === 0) {
					combinedTags[key] = pageTags[key];
				}
			}
		}

		return combinedTags;
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

	private getOptionalKeyVals(): OptionalStrategyParams {
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

		if (this.fandomContext.site.top1000) {
			keyVals.top = '1k';
		}

		return keyVals;
	}
}
