export function getAppnexusAstContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			placementId: '29038722',
		},
	};

	const mobileSlots = {
		video: {
			placementId: '29038735',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
