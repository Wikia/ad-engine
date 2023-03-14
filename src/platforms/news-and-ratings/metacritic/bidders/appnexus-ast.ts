export function getAppnexusAstContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			placementId: '29038919',
		},
	};

	const mobileSlots = {
		video: {
			placementId: '29038936',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
