export function getCriteoContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		top_boxad: {
			sizes: [[300, 250]],
		},
		incontent_boxad: {
			sizes: [[300, 250]],
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
		},
	};

	return {
		enabled: false,
		networkId: 3306,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
