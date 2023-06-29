export function getAppnexusContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				position: 'atf',
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
				position: 'atf',
			},
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				position: 'btf',
			},
			incontent_boxad_1: {
				sizes: [
					[160, 600],
					[300, 600],
					[300, 250],
				],
				position: 'hivi',
			},
			ntv_ad: {
				sizes: [[1, 1]],
				position: 'native',
			},
			fandom_dt_galleries: {
				sizes: [[728, 90]],
				position: 'gallery',
			},
		},
		placements: {
			atf: '11977073',
			btf: '11977096',
			hivi: '11977016',
			native: '25450069',
			other: '11969927',
			gallery: '30286507',
		},
	};
}
