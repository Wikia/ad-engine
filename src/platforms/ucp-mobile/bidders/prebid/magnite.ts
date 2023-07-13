export function getMagniteContext(): object {
	return {
		enabled: false,
		accountId: 7450,
		slots: {
			mobile_prefooter: {
				sizes: [[300, 250]],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
			mobile_top_leaderboard: {
				sizes: [
					[320, 50],
					[320, 100],
				],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
		},
	};
}
