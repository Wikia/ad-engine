export function getOzoneContext(): object {
	return {
		enabled: false,
		slots: {
			mobile_top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				pos: 'OZ_mobile_top_leaderboard',
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
				pos: 'OZ_top_boxad',
			},
			gallery_leaderboard: {
				sizes: [
					[320, 100],
					[320, 50],
				],
				pos: 'OZ_fandom_mw_galleries',
			},
			incontent_boxad_1: {
				sizes: [[300, 250]],
				pos: 'OZ_incontent_boxad',
			},
			bottom_leaderboard: {
				sizes: [[300, 250]],
				pos: 'OZ_mobile_prefooter',
			},
			floor_adhesion: {
				sizes: [
					[320, 50],
					[320, 100],
				],
				pos: 'OZ_floor_adhesion',
			},
		},
	};
}
