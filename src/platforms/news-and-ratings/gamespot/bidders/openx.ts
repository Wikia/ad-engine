export function getOpenXContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			unit: '559098623',
		},
	};

	const mobileSlots = {
		video: {
			unit: '559098624',
		},
	};

	return {
		enabled: false,
		delDomain: 'wikia-d.openx.net',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
