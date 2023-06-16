export function getOpenXContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			unit: '559098621',
		},
	};

	const mobileSlots = {
		video: {
			unit: '559098622',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
