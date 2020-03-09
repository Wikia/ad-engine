export function getAppnexusContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				position: 'atf',
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
				position: 'atf',
			},
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				position: 'btf',
			},
			incontent_boxad_1: {
				sizes: [[160, 600], [300, 600], [300, 250]],
				position: 'hivi',
			},
		},
		placements: {
			atf: '11977073',
			btf: '11977096',
			hivi: '11977016',
			other: '11969927',
		},
		recPlacements: {
			atf: '11823778',
			btf: '11823724',
			hivi: '11823799',
			other: '11969927',
		},
	};
}
