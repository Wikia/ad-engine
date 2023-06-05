export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			placementId: '_uAtUAaayo0',
		},
		bottom_leaderboard: {
			sizes: [[728, 90]],
			placementId: '_uAtUAaayo0',
		},
		top_boxad: {
			sizes: [[300, 250]],
			placementId: '_pC1SeRWmK7',
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
	};

	const mobileSlots = {
		incontent_boxad: {
			sizes: [[300, 250]],
			placementId: '_pC1SeRWmK7',
		},
		bottom_leaderboard: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
