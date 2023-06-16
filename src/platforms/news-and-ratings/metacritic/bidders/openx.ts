export function getOpenXContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			unit: '559098627',
		},
	};

	const mobileSlots = {
		video: {
			unit: '559098628',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
