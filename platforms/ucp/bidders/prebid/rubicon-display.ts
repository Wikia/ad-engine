export function getRubiconDisplayContext(): object {
	return {
		enabled: false,
		accountId: 7450,
		slots: {
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
				siteId: '148804',
				zoneId: '704672',
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
				siteId: '148804',
				zoneId: '704672',
			},
			incontent_boxad_1: {
				sizes: [[160, 600], [300, 600], [300, 250]],
				targeting: {
					loc: ['hivi'],
				},
				siteId: '148804',
				zoneId: '704676',
			},
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				targeting: {
					loc: ['footer'],
				},
				siteId: '148804',
				zoneId: '704674',
			},
		},
	};
}
