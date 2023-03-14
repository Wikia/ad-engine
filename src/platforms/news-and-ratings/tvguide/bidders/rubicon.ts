export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		featured: {
			siteId: '462852',
			zoneId: '2742560',
		},
	};

	const mobileSlots = {
		featured: {
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
