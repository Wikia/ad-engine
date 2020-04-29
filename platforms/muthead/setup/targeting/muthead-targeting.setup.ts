import { getDomain, getSportsPageType, TargetingSetup } from '@platforms/shared';
import { context, Targeting, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MutheadTargetingSetup implements TargetingSetup {
	configureTargetingContext(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const domain = getDomain();
		const cid = utils.queryString.get('cid');
		const targeting: Partial<Targeting> = {
			skin: `turf_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			uap: 'none',
			uap_c: 'none',
			s0: 'gaming',
			s1: 'muthead',
			s2: getSportsPageType(),
			dmn: `${domain.name}${domain.tld}`,
			geo: utils.geoService.getCountryCode() || 'none',
		};

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}
}
