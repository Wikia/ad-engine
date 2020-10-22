export function getAppnexusContext(): object {
	return {
		enabled: false,
		slots: {
			mobile_top_leaderboard: {
				sizes: [[320, 50]],
			},
			mobile_in_content: {
				sizes: [[300, 250]],
			},
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			floor_adhesion: {
				sizes: [
					[300, 50],
					[320, 50],
					[320, 100],
				],
				placementId: '17062362',
			},
		},
		placements: {
			ent: '9412992',
			gaming: '9412993',
			life: '9412994',
			other: '9412994',
		},
	};
}
