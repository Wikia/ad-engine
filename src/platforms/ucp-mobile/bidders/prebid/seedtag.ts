export function getSeedtagContext(): object {
	return {
		enabled: false,
		slots: {
			mobile_top_leaderboard: {
				sizes: [
					[320, 50],
					[320, 100],
				],
				publisherId: '7908-0833-01',
				adUnitId: '29832764',
				placement: 'inBanner',
			},
			mobile_prefooter: {
				sizes: [[300, 250]],
				publisherId: '7908-0833-01',
				adUnitId: '29832758',
				placement: 'inBanner',
			},
			floor_adhesion: {
				sizes: [
					[320, 50],
					[320, 100],
				],
				publisherId: '7908-0833-01',
				adUnitId: '29832715',
				placement: 'inScreen',
			},
			featured: {
				sizes: [[0, 0]],
				publisherId: '7908-0833-01',
				adUnitId: '29832808',
			},
		},
	};
}
