import { getDomain } from '@platforms/shared';
import { context, DiProcess, Targeting, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsTargetingSetup implements DiProcess {
	execute(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const domain = getDomain();
		const cid = utils.queryString.get('cid');
		const targeting: Partial<Targeting> = {
			kid_wiki: '0',
			skin: `turf_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			uap: 'none',
			uap_c: 'none',
			s0: 'gaming',
			s1: context.get('application'),
			s2: this.getSportsPageType(),
			dmn: `${domain.name}${domain.tld}`,
			geo: utils.geoService.getCountryCode() || 'none',
			is_mobile: context.get('state.isMobile') ? '1' : '0',
		};

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}

	private getSportsPageType(): string {
		const pathName = window.location.pathname;

		return !pathName || pathName === '/' ? 'home' : pathName;
	}
}
