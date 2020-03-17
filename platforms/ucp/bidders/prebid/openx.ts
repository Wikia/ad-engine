export function getOpenXContext(): object {
	return {
		enabled: false,
		delDomain: 'wikia-d.openx.net',
		slots: {
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				unit: 538735690,
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
				unit: 538735691,
			},
			incontent_boxad_1: {
				sizes: [[300, 250], [300, 600], [160, 600]],
				unit: 538735697,
			},
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				unit: 539119447,
			},
		},
	};
}
