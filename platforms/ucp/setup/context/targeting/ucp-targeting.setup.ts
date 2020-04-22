import { getDomain, getUcpAdLayout, getUcpHostnamePrefix, TargetingSetup } from '@platforms/shared';
import { context, Targeting, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpTargetingSetup implements TargetingSetup {
	configureTargetingContext(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });

		if (context.get('wiki.opts.isAdTestWiki')) {
			context.set('src', 'test');
		}
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const cid = utils.queryString.get('cid');
		const wiki: MediaWikiAdsContext = context.get('wiki');
		const domain = getDomain();

		const targeting: Partial<Targeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			artid: wiki.targeting.pageArticleId ? wiki.targeting.pageArticleId.toString() : '',
			dmn: domain.base,
			esrb: wiki.targeting.esrbRating,
			geo: utils.geoService.getCountryCode() || 'none',
			hostpre: getUcpHostnamePrefix(),
			lang: wiki.targeting.wikiLanguage || 'unknown',
			s0: wiki.targeting.mappedVerticalName,
			s0v: wiki.targeting.wikiVertical,
			s0c: wiki.targeting.newWikiCategories,
			s1: this.getRawDbName(wiki),
			s2: getUcpAdLayout(wiki.targeting),
			skin: 'oasis',
			uap: 'none',
			uap_c: 'none',
			wpage: wiki.targeting.pageName && wiki.targeting.pageName.toLowerCase(),
		};

		if (context.get('wiki.pvNumber')) {
			targeting.pv = context.get('wiki.pvNumber').toString();
		}

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}

	private getRawDbName(adsContext: MediaWikiAdsContext): string {
		return `_${adsContext.targeting.wikiDbName || 'wikia'}`.replace('/[^0-9A-Z_a-z]/', '_');
	}
}
