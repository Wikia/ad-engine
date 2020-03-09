export function getTripleliftContext(): object {
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				inventoryCodes: ['Fandom_DT_LB_728x90_hdx_prebid', 'Fandom_DT_LB_970x250_hdx_prebid'],
			},
			top_boxad: {
				sizes: [[300, 250], [300, 600]],
				inventoryCodes: ['Fandom_DT_MR_300x250_prebid', 'Fandom_DT_MR_300x600_prebid'],
			},
			incontent_boxad_1: {
				sizes: [[160, 600], [300, 600], [300, 250]],
				inventoryCodes: [
					'Fandom_DT_FMR_160x600_hdx_prebid',
					'Fandom_DT_FMR_300x250_hdx_prebid',
					'Fandom_DT_FMR_300x600_hdx_prebid',
				],
			},
			bottom_leaderboard: {
				sizes: [[728, 90], [970, 250]],
				inventoryCodes: ['Fandom_DT_BLB_728x90_hdx_prebid', 'Fandom_DT_BLB_970x250_hdx_prebid'],
			},
		},
	};
}
