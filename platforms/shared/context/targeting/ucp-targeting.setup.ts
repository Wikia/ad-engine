import {
	Binder,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	Targeting,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { getDomain } from '../../utils/get-domain';

const SKIN = Symbol('targeting skin');

@Injectable()
export class UcpTargetingSetup implements DiProcess {
	static skin(skin: string): Binder {
		return {
			bind: SKIN,
			value: skin,
		};
	}

	constructor(@Inject(SKIN) private skin: string, protected instantConfig: InstantConfigService) {}

	execute(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });

		if (context.get('wiki.opts.isAdTestWiki') && context.get('wiki.targeting.testSrc')) {
			context.set('src', [context.get('wiki.targeting.testSrc')]);
		} else if (context.get('wiki.opts.isAdTestWiki')) {
			context.set('src', ['test']);
		}

		if (context.get('options.uapExtendedSrcTargeting')) {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					if (action.isLoaded || action.adProduct === 'ruap') {
						context.push('src', 'uap');
					}
				},
			);
		}

		if (context.get('wiki.targeting.wikiIsTop1000')) {
			context.set('custom.wikiIdentifier', '_top1k_wiki');
			context.set('custom.dbNameForAdUnit', context.get('targeting.s1'));
		}

		context.set(
			'targeting.bundles',
			utils.targeting.getTargetingBundles(this.instantConfig.get('icTargetingBundles')),
		);
	}

	private getPageLevelTargeting(): Partial<Targeting> {
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

	private getPageType(targeting: MediaWikiAdsTargeting): string {
		return targeting.pageType || 'article';
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
