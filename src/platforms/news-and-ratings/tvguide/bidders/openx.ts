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
		delDomain: 'wikia-d.openx.net',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
