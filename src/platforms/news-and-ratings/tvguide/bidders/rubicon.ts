export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			siteId: '462852',
			zoneId: '2742560',
		},
	};

	const mobileSlots = {
		video: {
			siteId: '462854',
			zoneId: '2742562',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
