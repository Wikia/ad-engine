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
			s2: this.isSquadPage() ? 'squad' : this.getSportsPageType(),
			dmn: `${domain.name}${domain.tld}`,
			geo: utils.geoService.getCountryCode() || 'none',
			is_mobile: context.get('state.isMobile') ? '1' : '0',
		};

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}

	private isSquadPage(): boolean {
		if (context.get('application') === 'muthead') {
			return false;
		}

		const squadPageRegex = /\/\d+\/squads\/\d+/;
		return !!window.location.pathname.match(squadPageRegex);
	}

	private getSportsPageType(): string {
		const pathName = window.location.pathname;
		const hostname = window.location.hostname.toLowerCase();
		const pieces = hostname.split('.').filter((piece) => piece !== 'www');

		if (pieces[0] === 'old') {
			return 'old';
		}

		return !pathName || pathName === '/' ? 'home' : 'main';
	}
}
