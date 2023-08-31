export function getOzoneContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				name: 'OZ_top_leaderboard',
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
				name: 'OZ_top_boxad',
			},
			incontent_leaderboard: {
				sizes: [[728, 90]],
				name: 'OZ_incontent_leaderboard',
			},
			fandom_dt_galleries: {
				sizes: [[728, 90]],
				name: 'OZ_fandom_dt_galleries',
			},
			incontent_boxad_1: {
				sizes: [[300, 250]],
				name: 'OZ_incontent_boxad',
			},
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				name: 'OZ_bottom_leaderboard',
			},
		},
	};
}
