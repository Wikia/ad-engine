export function getOzoneContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				pos: 'OZ_top_leaderboard',
				placementId: '3500013043',
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
				pos: 'OZ_top_boxad',
				placementId: '3500013044',
			},
			incontent_leaderboard: {
				sizes: [[728, 90]],
				pos: 'OZ_incontent_leaderboard',
				placementId: '3500013047',
			},
			fandom_dt_galleries: {
				sizes: [[728, 90]],
				pos: 'OZ_fandom_dt_galleries',
				placementId: '3500013051',
				filterGroups: ['gallery'],
			},
			incontent_boxad_1: {
				sizes: [[300, 250]],
				pos: 'OZ_incontent_boxad',
				placementId: '3500013048',
			},
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				pos: 'OZ_bottom_leaderboard',
				placementId: '3500013050',
			},
		},
	};
}
