export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		featured: {
			siteId: '462828',
			zoneId: '2742538',
		},
	};

	const mobileSlots = {
		featured: {
			siteId: '462830',
			zoneId: '2742540',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
