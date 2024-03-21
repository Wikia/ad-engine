import { context, SlotTargeting, utils } from '@wikia/ad-engine';
import { getDomain } from '../../../../utils/get-domain';
import { getMediaWikiVariable } from '../../../../utils/get-media-wiki-variable';
import { CommonTargetingParams } from '../interfaces/common-targeting-params';
import { OptionalTargetingParams } from '../interfaces/optional-targeting-params';
import { TargetingProvider } from '../interfaces/targeting-provider';
import { FandomContext } from '../models/fandom-context';

export class CommonTags implements TargetingProvider<Partial<SlotTargeting>> {
	constructor(private fandomContext: FandomContext) {}

	get(): Partial<SlotTargeting> {
		return this.getCommonParams();
	}

	public getCommonParams(): Partial<SlotTargeting> {
		const domain = getDomain();
		const wiki: AdsContext = context.get('wiki');
		const isMobile = context.get('state.isMobile');

		const commonParams: Partial<SlotTargeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			dmn: domain.base,
			geo: utils.geoService.getCountryCode() || 'none',
			hostpre: utils.targeting.getHostnamePrefix(),
			original_host: wiki.opts?.isGamepedia ? 'gamepedia' : 'fandom',
			// Make more general after rolling out strategies outside UCP
			skin: isMobile ? 'ucp_mobile' : 'ucp_desktop',
			uap: 'none',
			uap_c: 'none',
			is_mobile: isMobile ? '1' : '0',
		};

		const commonContextParams: CommonTargetingParams = {
			artid: this.fandomContext.page.articleId?.toString() || '',
			kid_wiki: this.fandomContext.site.directedAtChildren ? '1' : '0',
			lang: this.fandomContext.page.lang || 'unknown',
			s0: this.fandomContext.site.taxonomy?.[0],
			s0c: this.fandomContext.site.categories,
			// Remove 'wiki.targeting.wikiVertical' after ADEN-12118 is done
			s0v: this.fandomContext.site.taxonomy?.[1] || wiki.targeting.wikiVertical,
			s1: utils.targeting.getRawDbName(this.fandomContext.site.siteName),
			s2: this.getAdLayout(this.fandomContext.page.pageType || 'article'),
			wpage: this.fandomContext.page.pageName?.toLowerCase(),
			word_count: this.fandomContext.page.wordCount?.toString() || '',
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
			// COTECH-1007: No video experiment - function set in UCP
			!window.fandomIsVideoPossible?.() &&
			!!document.querySelector(context.get('templates.incontentAnchorSelector'));

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

	private getVideoStatus(): VideoStatus {
		const featuredVideoData = getMediaWikiVariable('wgArticleFeaturedVideo');
		if (featuredVideoData) {
			// Comparing with false in order to make sure that API already responds with "isDedicatedForArticle" flag
			const isDedicatedForArticle = featuredVideoData.isDedicatedForArticle !== false;

			return {
				isDedicatedForArticle,
				hasVideoOnPage: window?.canPlayVideo(),
			};
		}

		return {};
	}

	// @TODO: This should not be here. It is a side effect that is unpredictable.
	private updateVideoContext(hasFeaturedVideo, hasIncontentPlayer): void {
		context.set('custom.hasFeaturedVideo', hasFeaturedVideo);
		context.set('custom.hasIncontentPlayer', hasIncontentPlayer);
	}

	private getOptionalKeyVals(): OptionalTargetingParams {
		const keyVals: OptionalTargetingParams = {};

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

		if (this.fandomContext.site?.tags?.esrb || this.fandomContext.site?.tags?.mpa) {
			keyVals.rating = this.createRatingTag(
				this.fandomContext.site?.tags?.esrb,
				this.fandomContext.site?.tags?.mpa,
			);
		}

		if (this.fandomContext.site.top1000) {
			keyVals.top = '1k';
		}

		return keyVals;
	}

	private createRatingTag(esrbRating: string[], mpaRating: string[]): string {
		const ratingTags = [];

		esrbRating ? ratingTags.push(...esrbRating.map((rating) => 'esrb:' + rating)) : null;
		mpaRating ? ratingTags.push(...mpaRating.map((rating) => 'mpa:' + rating)) : null;
		return ratingTags.join(',');
	}
}
