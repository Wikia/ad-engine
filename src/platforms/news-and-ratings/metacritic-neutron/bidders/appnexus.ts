export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			placementId: ['28574573'],
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574579', '28574574'],
		},
		top_boxad: {
			sizes: [[300, 250]],
			placementId: ['28574576'],
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			placementId: ['28574589'],
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
			placementId: ['28574586'],
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574578', '28574590'],
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
			placementId: ['28574592', '28574589'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
