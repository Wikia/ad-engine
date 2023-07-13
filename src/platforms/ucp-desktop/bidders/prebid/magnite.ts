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
			incontent_leaderboard: {
				sizes: [[728, 90]],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
			incontent_boxad: {
				sizes: [[300, 250]],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
			floor_adhesion: {
				sizes: [
					[320, 50],
					[320, 100],
				],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				targeting: {
					loc: ['top'],
				},
				position: 'atf',
			},
		},
	};
}
