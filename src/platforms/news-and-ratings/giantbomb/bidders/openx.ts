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
		delDomain: 'wikia-d.openx.net',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
