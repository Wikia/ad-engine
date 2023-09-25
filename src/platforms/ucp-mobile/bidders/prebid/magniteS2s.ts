export function getMagniteS2sContext(): object {
	return {
		enabled: false,
		accountId: 7450,
		slots: {
			mobile_prefooter: {
				sizes: [[300, 250]],
			},
			mobile_top_leaderboard: {
				sizes: [
					[320, 50],
					[320, 100],
				],
			},
			mobile_in_content: {
				sizes: [[300, 250]],
			},
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			floor_adhesion: {
				sizes: [
					[300, 50],
					[320, 50],
					[320, 100],
				],
			},
			interstitial: {
				sizes: [[320, 480]],
			},
			gallery_leaderboard: {
				sizes: [
					[320, 100],
					[320, 50],
				],
			},
			featured: {
				sizes: [[0, 0]],
			},
			incontent_player: {
				sizes: [[0, 0]],
			},
		},
	};
}
