import { getDomain, TargetingSetup } from '@platforms/shared';
import { context, Targeting, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpTargetingSetup implements TargetingSetup {
	configureTargetingContext(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const cid = utils.queryString.get('cid');
		const wiki: MediaWikiAdsContext = context.get('wiki');
		const domain = getDomain();

		const targeting: Partial<Targeting> = {
			ar: window.innerWidth > window.innerHeight ? '4:3' : '3:4',
			artid: wiki.targeting.pageArticleId,
			dmn: domain.base,
			esrb: wiki.targeting.esrbRating,
			geo: utils.geoService.getCountryCode() || 'none',
			hostpre: this.getHostnamePrefix(),
			lang: wiki.targeting.wikiLanguage || 'unknown',
			s0: wiki.targeting.mappedVerticalName,
			s1: `_${wiki.targeting.wikiDbName}`,
			s2: wiki.targeting.pageType,
			skin: 'ucp',
			uap: 'none',
			uap_c: 'none',
			wpage: wiki.targeting.pageName && wiki.targeting.pageName.toLowerCase(),
		};

		if (window.pvNumber) {
			targeting.pv = window.pvNumber.toString();
		}

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}

	private getHostnamePrefix(): string {
		const hostname = window.location.hostname.toLowerCase();
		const match = /(^|.)(showcase|externaltest|preview|verify|stable|sandbox-[^.]+)\./.exec(
			hostname,
		);

		if (match && match.length > 2) {
			return match[2];
		}

		const pieces = hostname.split('.');

		if (pieces.length) {
			return pieces[0];
		}

		return undefined;
	}
}
