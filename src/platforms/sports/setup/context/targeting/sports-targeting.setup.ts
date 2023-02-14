import { getDomain } from '@platforms/shared';
import { context, DiProcess, SlotTargeting, targetingService, utils } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

import { getPageType } from '../../../utils/pagetype-helper';

@injectable()
export class SportsTargetingSetup implements DiProcess {
	execute(): void {
		targetingService.extend({
			...targetingService.dump(),
			...this.getPageLevelTargeting(),
		});
	}

	private getPageLevelTargeting(): Partial<SlotTargeting> {
		const domain = getDomain();
		const pathName = this.getPathName();
		const cid = utils.queryString.get('cid');
		const targeting: Partial<SlotTargeting> = {
			kid_wiki: '0',
			skin: `turf_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			uap: 'none',
			uap_c: 'none',
			s0: 'gaming',
			s1: context.get('application'),
			s2: getPageType(pathName),
			pth: pathName,
			dmn: `${domain.name}${domain.tld}`,
			geo: utils.geoService.getCountryCode() || 'none',
			is_mobile: context.get('state.isMobile') ? '1' : '0',
		};

		if (cid !== undefined) {
			targeting.cid = cid;
		}

		return targeting;
	}

	private getPathName(): string {
		return window.location.pathname;
	}
}
