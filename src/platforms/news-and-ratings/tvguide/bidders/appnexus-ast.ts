export function getAppnexusAstContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			placementId: '29038953',
		},
	};

	const mobileSlots = {
		video: {
			placementId: '29038972',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
