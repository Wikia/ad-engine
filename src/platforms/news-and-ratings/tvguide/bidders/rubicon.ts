export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		slots: {
			featured: {
				siteId: '462852',
				sizeId: '201',
				zoneId: '2742560',
			},
			incontent_player: {
				siteId: '462852',
				sizeId: '203',
				zoneId: '2742560',
			},
		},
	};

	const mobileSlots = {
		slots: {
			featured: {
				siteId: '462854',
				sizeId: '201',
				zoneId: '2742562',
			},
			incontent_player: {
				siteId: '462854',
				sizeId: '203',
				zoneId: '2742562',
			},
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
