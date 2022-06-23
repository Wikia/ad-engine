import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { context, Targeting, utils } from '@wikia/ad-engine';
import { getDomain } from '../../../../utils/get-domain';
import { Context } from '../interfaces/window-context-dto';

export class PageContextStrategy implements TargetingStrategy {
	constructor(private skin: string, private context: Context) {}

	execute(): Partial<Targeting> {
		const cid = utils.queryString.get('cid');
		const wiki: MediaWikiAdsContext = context.get('wiki');
		const domain = getDomain();

		const targeting: Partial<Targeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			age: this.context.page.tags?.age || [],
			dmn: domain.base,
			esrb: this.context.site.esrbRating,
			geo: utils.geoService.getCountryCode() || 'none',
			gnre: this.context.page.tags?.gnre || [],
			hostpre: utils.targeting.getHostnamePrefix(),
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			media: this.context.page.tags?.media || [],
			original_host: wiki.opts?.isGamepedia ? 'gamepedia' : 'fandom',
			pform: this.context.page.tags?.pform || [],
			pub: this.context.page.tags?.pub || [],
			s0: this.context.site.vertical,
			// TODO remove, but be careful. According to Sebastian S. this can be removed, but AdEng will fail to load ads without it.
			s0v: wiki.targeting.wikiVertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(this.context.site.siteName),
			s2: this.getAdLayout(this.context.page.pageType),
			sex: this.context.page.tags?.sex || [],
			skin: this.skin,
			theme: this.context.page.tags?.theme || [],
			tv: this.context.page.tags?.tv || [],
			uap: 'none',
			uap_c: 'none',
			wpage: this.context.page.pageName && this.context.page.pageName.toLowerCase(),
			is_mobile: utils.client.isMobileSkin(this.skin) ? '1' : '0',
		};

		if (context.get('wiki.pvNumber')) {
			targeting.pv = context.get('wiki.pvNumber').toString();
		}

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return targeting;
	}

	private getAdLayout(pageType?: string): string {
		let adLayout = pageType || 'article';

		const videoStatus = this.getVideoStatus();
		const hasFeaturedVideo = !!videoStatus.hasVideoOnPage;
		const hasIncontentPlayer =
			!hasFeaturedVideo &&
			!!document.querySelector(context.get('slots.incontent_player.insertBeforeSelector'));

		if (adLayout === 'article') {
			if (hasFeaturedVideo) {
				const videoPrefix = videoStatus.isDedicatedForArticle ? 'fv' : 'wv';

				adLayout = `${videoPrefix}-${adLayout}`;
			} else if (hasIncontentPlayer) {
				adLayout = `${adLayout}-ic`;
			}
		}

		this.updateVideoContext(hasFeaturedVideo, hasIncontentPlayer);

		return adLayout;
	}

	private getVideoStatus(): VideoStatus {
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

	// @TODO: This should not be here. It is a side effect that is unpredictable.
	private updateVideoContext(hasFeaturedVideo, hasIncontentPlayer): void {
		context.set('custom.hasFeaturedVideo', hasFeaturedVideo);
		context.set('custom.hasIncontentPlayer', hasIncontentPlayer);
	}
}
