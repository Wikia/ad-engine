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
		delDomain: 'wikia-d.openx.net',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
