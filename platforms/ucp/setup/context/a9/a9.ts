export function getA9Context(): object {
	return {
		dealsEnabled: false,
		enabled: false,
		videoEnabled: false,
		amazonId: '3115',
		slots: {
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
			},
			incontent_boxad_1: {
				sizes: [[300, 250], [300, 600]],
			},
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
			},
			featured: {
				type: 'video',
			},
		},
	};
}
