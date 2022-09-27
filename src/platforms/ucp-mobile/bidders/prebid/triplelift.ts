export function getTripleliftContext(): object {
	return {
		enabled: false,
		slots: {
			mobile_top_leaderboard: {
				sizes: [[320, 50]],
				inventoryCodes: ['Fandom_MW_LB_320x50_hdx_prebid'],
			},
			mobile_in_content: {
				sizes: [[300, 250]],
				inventoryCodes: ['Fandom_Mobile_InContent_prebid'],
			},
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
				inventoryCodes: ['Fandom_MW_PF_300x250_hdx_prebid', 'Fandom_MW_PF_320x50_hdx_prebid'],
			},
		},
	};
}
