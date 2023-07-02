export function getMagniteContext(): object {
	return {
		enabled: false,
		accountId: 7450,
		slots: {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
		},
	};
}
