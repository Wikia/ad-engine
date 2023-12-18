export function getMagniteS2sContext(video = false): object {
	const context = {
		enabled: false,
		accountId: 7450,
		slots: {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
			},
			incontent_leaderboard: {
				sizes: [[728, 90]],
			},
			incontent_boxad_1: {
				sizes: [
					[160, 600],
					[300, 600],
					[300, 250],
				],
			},
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			featured: {
				sizes: [[640, 480]],
			},
			fandom_dt_galleries: {
				sizes: [[728, 90]],
			},
		},
	};

	if (!video) {
		return context;
	}
	console.log('icMagniteS2sVideo', context);

	return {
		...context,
		featured: {
			sizes: [[640, 480]],
		},
	};
}
