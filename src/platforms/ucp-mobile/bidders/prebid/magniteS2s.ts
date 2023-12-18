export function getMagniteS2sContext(video = false): object {
	const context = {
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
			bottom_leaderboard: {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			floor_adhesion: {
				sizes: [
					[320, 50],
					[320, 100],
				],
			},
			incontent_boxad: {
				sizes: [[300, 250]],
			},
			gallery_leaderboard: {
				sizes: [
					[320, 50],
					[320, 100],
				],
			},
			featured: {
				sizes: [[640, 480]],
			},
		},
	};

	if (!video) {
		return context;
	}

	return {
		...context,
		featured: {
			sizes: [[640, 480]],
		},
	};
}
