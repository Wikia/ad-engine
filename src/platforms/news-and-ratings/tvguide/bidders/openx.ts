export function getOpenXContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			unit: '559098629',
		},
	};

	const mobileSlots = {
		video: {
			unit: '559098630',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
