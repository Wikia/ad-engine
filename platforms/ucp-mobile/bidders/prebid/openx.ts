export function getOpenXContext(): object {
	return {
		enabled: false,
		delDomain: 'wikia-d.openx.net',
		slots: {
			mobile_top_leaderboard: {
				sizes: [[320, 50]],
				unit: 538735698,
			},
			mobile_in_content: {
				sizes: [[300, 250]],
				unit: 538735699,
			},
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
				unit: 538735700,
			},
		},
	};
}
