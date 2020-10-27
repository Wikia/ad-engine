import { getDomain, getSportsPageType } from '@platforms/shared';
import { context, DiProcess, Targeting, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FutheadTargetingSetup implements DiProcess {
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
			s1: 'futhead',
			s2: this.isSquadPage() ? 'squad' : getSportsPageType(),
			dmn: `${domain.name}${domain.tld}`,
			geo: utils.geoService.getCountryCode() || 'none',
		};

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}

	private isSquadPage(): boolean {
		const squadPageRegex = /\/\d+\/squads\/\d+/;
		return !!window.location.pathname.match(squadPageRegex);
	}
}
