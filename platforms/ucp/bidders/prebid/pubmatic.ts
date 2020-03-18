export function getPubmaticContext(): object {
	return {
		enabled: false,
		publisherId: '156260',
		slots: {
			featured: {
				sizes: [[0, 0]],
				ids: ['1636185@0x0'],
			},
			incontent_player: {
				sizes: [[0, 0]],
				ids: ['1636186@0x0'],
			},
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				ids: ['/5441/TOP_LEADERBOARD_728x90@728x90', '/5441/TOP_LEADERBOARD_970x250@970x250'],
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
				ids: ['/5441/TOP_RIGHT_BOXAD_300x250@300x250', '/5441/TOP_RIGHT_BOXAD_300x600@300x600'],
			},
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				ids: ['/5441/BOTTOM_LEADERBOARD_728x90@728x90', '/5441/BOTTOM_LEADERBOARD_970x250@970x250'],
			},
			incontent_boxad_1: {
				sizes: [[160, 600], [300, 600], [300, 250]],
				ids: [
					'/5441/INCONTENT_BOXAD_1_160x600@160x600',
					'/5441/INCONTENT_BOXAD_1_300x250@300x250',
					'/5441/INCONTENT_BOXAD_1_300x600@300x600',
				],
			},
		},
	};
}
