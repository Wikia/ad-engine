import { context, Targeting, utils } from '@wikia/ad-engine';

export function getPageLevelTargeting(): Partial<Targeting> {
	const domain = getDomain();
	const cid = utils.queryString.get('cid');
	const targeting: Partial<Targeting> = {
		ae3: '1',
		skin: `turf_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		uap: 'none',
		uap_c: 'none',
		s0: 'gaming',
		s1: domain.name,
		s2: 'main',
		dmn: `${domain.name}${domain.tld}`,
	};

	if (cid !== undefined) {
		targeting.cid = cid;
	}

	return targeting;
}

function getDomain(): { name: string; tld: string } {
	const hostname = window.location.hostname.toLowerCase();
	const pieces = hostname.split('.');
	const np = pieces.length;

	return {
		name: pieces[np - 2],
		tld: pieces[np - 1],
	};
}
