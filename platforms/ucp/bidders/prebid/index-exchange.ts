export function getIndexExchangeContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				siteId: '183423',
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
				siteId: '183567',
			},
			incontent_boxad_1: {
				sizes: [[160, 600], [300, 600], [300, 250]],
				siteId: '185049',
			},
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				siteId: '209250',
			},
			featured: {
				siteId: '437502',
			},
		},
		recPlacements: {
			top_leaderboard: '215807',
			top_boxad: '215808',
			incontent_boxad_1: '215809',
			bottom_leaderboard: '215810',
		},
	};
}
