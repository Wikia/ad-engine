import { Dictionary, utils } from '@wikia/ad-engine';

export function getPageLevelTargeting(): Dictionary<string> {
	const domain = getDomain();

	return {
		dmn: `${domain.name}${domain.tld}`,
		s1: domain.name,
		cid: utils.queryString.get('cid'),
	};
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
