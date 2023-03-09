export function getPubmaticContext(): object {
	return {
		enabled: false,
		publisherId: '156260',
		slots: {
			featured: {
				sizes: [[0, 0]],
				ids: ['1636187@0x0'],
			},
			interstitial: {
				sizes: [[320, 480]],
				ids: ['Fandom_Mobile_Interstitial'],
			},
			mobile_top_leaderboard: {
				sizes: [[320, 50]],
				ids: ['/5441/MOBILE_TOP_LEADERBOARD_320x50@320x50'],
			},
			mobile_in_content: {
				sizes: [[300, 250]],
				ids: ['/5441/MOBILE_IN_CONTENT_300x250@300x250'],
			},
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
				ids: ['/5441/MOBILE_PREFOOTER_300x250@300x250', '/5441/MOBILE_PREFOOTER_320x50@320x50'],
			},
		},
	};
}
