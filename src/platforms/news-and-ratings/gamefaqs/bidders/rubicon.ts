export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			siteId: '462802',
			zoneId: '2742534',
		},
	};

	const mobileSlots = {
		video: {
			siteId: '462804',
			zoneId: '2742536',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
