export function getWikiaContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [[728, 90]],
			},
			top_boxad: {
				sizes: [[300, 250]],
			},
			incontent_boxad_1: {
				sizes: [
					[300, 250],
					[728, 90],
				],
			},
			bottom_leaderboard: {
				sizes: [[970, 250]],
			},
			ntv_ad: {
				sizes: [[1, 1]],
				position: 'native',
			},
		},
	};
}
