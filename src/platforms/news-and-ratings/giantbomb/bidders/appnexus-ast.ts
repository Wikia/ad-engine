export function getAppnexusAstContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			placementId: '29038862',
		},
	};

	const mobileSlots = {
		video: {
			placementId: '29038899',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
