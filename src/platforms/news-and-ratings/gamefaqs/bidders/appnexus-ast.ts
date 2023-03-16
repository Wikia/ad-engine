export function getAppnexusAstContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			placementId: '29038681',
		},
	};

	const mobileSlots = {
		video: {
			placementId: '29038704',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
