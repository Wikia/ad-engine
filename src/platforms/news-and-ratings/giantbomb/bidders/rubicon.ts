export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		featured: {
			siteId: '462834',
			zoneId: '2742544',
		},
	};

	const mobileSlots = {
		featured: {
			siteId: '462836',
			zoneId: '2742550',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
