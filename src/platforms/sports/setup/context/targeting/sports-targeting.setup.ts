import { getDomain } from '@platforms/shared';
import { context, DiProcess, SlotTargeting, targetingService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { selectApplication } from '../../../utils/application-helper';

@Injectable()
export class SportsTargetingSetup implements DiProcess {
	execute(): void {
		targetingService.extend({
			...targetingService.dumpTargeting(),
			...this.getPageLevelTargeting(),
		});
	}

	private getPageLevelTargeting(): Partial<SlotTargeting> {
		const domain = getDomain();
		const cid = utils.queryString.get('cid');
		const targeting: Partial<SlotTargeting> = {
			kid_wiki: '0',
			skin: `turf_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			uap: 'none',
			uap_c: 'none',
			s0: 'gaming',
			s1: context.get('application'),
			s2: this.isSquadPage() ? 'squad' : this.getSportsPageType(),
			pth: this.getPathName(),
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
		const squadPageRegex = /\/\d+\/squads\/\d+/;

		return selectApplication(!!window.location.pathname.match(squadPageRegex), false);
	}

	private getPathName(): string {
		return window.location.pathname;
	}

	private getSportsPageType(): string {
		const pathName = this.getPathName();

		return !pathName || pathName === '/' ? 'home' : 'main';
	}
}
