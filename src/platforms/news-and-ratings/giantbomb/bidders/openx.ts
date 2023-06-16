export function getOpenXContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			unit: '559098625',
		},
	};

	const mobileSlots = {
		video: {
			unit: '559098633',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
