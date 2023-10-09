export function getSeedtagContext(): object {
	console.log('>>> Context');
	return {
		enabled: false,
		slots: {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
				publisherId: '7908-0833-01',
				adUnitId: '29832730',
			},
		},
	};
}
