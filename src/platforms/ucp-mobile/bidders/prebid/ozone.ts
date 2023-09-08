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
				placementId: '3500013046',
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
				pos: 'OZ_top_boxad',
				placementId: '3500013044',
			},
			gallery_leaderboard: {
				sizes: [
					[320, 100],
					[320, 50],
				],
				pos: 'OZ_fandom_mw_galleries',
				placementId: '3500013052',
			},
			incontent_boxad_1: {
				sizes: [[300, 250]],
				pos: 'OZ_incontent_boxad',
				placementId: '3500013048',
			},
			bottom_leaderboard: {
				sizes: [[300, 250]],
				pos: 'OZ_mobile_prefooter',
				placementId: '3500013045',
			},
			floor_adhesion: {
				sizes: [
					[320, 50],
					[320, 100],
				],
				pos: 'OZ_floor_adhesion',
				placementId: '3500013049',
			},
		},
	};
}
