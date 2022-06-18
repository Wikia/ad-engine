import { context, Targeting, utils } from '@wikia/ad-engine';
import { getDomain } from '../../../../utils/get-domain';
import { TargetingStrategy } from '../interfaces/targeting-strategy';

export class LegacyStrategy implements TargetingStrategy {
	constructor(private skin: string) {}

	execute(): Partial<Targeting> {
		const cid = utils.queryString.get('cid');
		const wiki: MediaWikiAdsContext = context.get('wiki');
		const domain = getDomain();

		const targeting: Partial<Targeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			artid: wiki.targeting.pageArticleId ? wiki.targeting.pageArticleId.toString() : '',
			age: wiki.targeting?.adTagManagerTags?.age || [],
			dmn: domain.base,
			esrb: wiki.targeting.esrbRating,
			geo: utils.geoService.getCountryCode() || 'none',
			gnre: wiki.targeting?.adTagManagerTags?.gnre || [],
			hostpre: utils.targeting.getHostnamePrefix(),
			kid_wiki: wiki.targeting.directedAtChildren ? '1' : '0',
			lang: wiki.targeting.wikiLanguage || 'unknown',
			media: wiki.targeting?.adTagManagerTags?.media || [],
			original_host: wiki.opts?.isGamepedia ? 'gamepedia' : 'fandom',
			pform: wiki.targeting?.adTagManagerTags?.pform || [],
			pub: wiki.targeting?.adTagManagerTags?.pub || [],
			s0: wiki.targeting.mappedVerticalName,
			// TODO remove, but be careful. According to Sebastian S. this can be removed, but AdEng will fail to load ads without it.
			s0v: wiki.targeting.wikiVertical,
			s0c: wiki.targeting.newWikiCategories,
			s1: utils.targeting.getRawDbName(wiki.targeting.wikiDbName),
			s2: this.getAdLayout(wiki.targeting),
			sex: wiki.targeting?.adTagManagerTags?.sex || [],
			skin: this.skin,
			theme: wiki.targeting?.adTagManagerTags?.theme || [],
			tv: wiki.targeting?.adTagManagerTags?.tv || [],
			uap: 'none',
			uap_c: 'none',
			wpage: wiki.targeting.pageName && wiki.targeting.pageName.toLowerCase(),
			is_mobile: utils.client.isMobileSkin(this.skin) ? '1' : '0',
		};

		if (context.get('wiki.pvNumber')) {
			targeting.pv = context.get('wiki.pvNumber').toString();
		}

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		if (wiki.targeting.wikiIsTop1000) {
			targeting.top = '1k';
		}

		return targeting;
	}

	private getAdLayout(targeting: MediaWikiAdsTargeting): string {
		let adLayout = this.getPageType(targeting);
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

	private getPageType(targeting: MediaWikiAdsTargeting): string {
		return targeting.pageType || 'article';
	}

	// @TODO: This should not be here. It is a side effect that is unpredictable.
	private updateVideoContext(hasFeaturedVideo, hasIncontentPlayer): void {
		context.set('custom.hasFeaturedVideo', hasFeaturedVideo);
		context.set('custom.hasIncontentPlayer', hasIncontentPlayer);
	}
}
