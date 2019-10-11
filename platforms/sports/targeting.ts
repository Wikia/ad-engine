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
		s1: domain.app,
		s2: getPageType(),
		dmn: `${domain.name}${domain.tld}`,
	};

	if (cid !== undefined) {
		targeting.cid = cid;
	}

	return targeting;
}

function getDomain(): { name: string; app: string; tld: string } {
	const hostname = window.location.hostname.toLowerCase();
	const pieces = hostname.split('.').filter((piece) => piece !== 'www');

	return {
		name: pieces.slice(0, -1).join(''),
		app: pieces[pieces.length - 2],
		tld: pieces.slice(-1).join(''),
	};
}

function getPageType(): string {
	const pathName = window.location.pathname;

	return !pathName || pathName === '/' ? 'home' : 'main';
}
