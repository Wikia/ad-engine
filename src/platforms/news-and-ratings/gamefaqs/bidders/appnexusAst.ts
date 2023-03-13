export function getAppnexusAstContext(isDesktop: boolean): object {
	const desktopSlots = {
		slots: {
			incontent_player: {
				placementId: '29038681',
			},
		},
	};

	const mobileSlots = {
		slots: {
			incontent_player: {
				placementId: '29038704',
			},
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		debugPlacementId: '5768085',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
