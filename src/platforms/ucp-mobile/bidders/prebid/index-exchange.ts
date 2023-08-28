export function getIndexExchangeContext(): object {
	return {
		enabled: false,
		slots: {
			mobile_top_leaderboard: {
				sizes: [[320, 50]],
				siteId: '183568',
			},
			mobile_in_content: {
				sizes: [[300, 250]],
				siteId: '185055',
			},
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
				siteId: '185056',
			},
			floor_adhesion: {
				sizes: [
					[300, 50],
					[320, 50],
					[320, 100],
				],
				siteId: '419027',
			},
			interstitial: {
				sizes: [[320, 480]],
				siteId: '749519',
			},
			gallery_leaderboard: {
				sizes: [
					[320, 100],
					[320, 50],
				],
				siteId: ['1019180'],
			},
			featured: {
				siteId: '437503',
			},
		},
	};
}
