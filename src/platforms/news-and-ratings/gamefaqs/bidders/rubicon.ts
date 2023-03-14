export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		slots: {
			featured: {
				siteId: '462802',
				sizeId: '201',
				zoneId: '2742534',
			},
			incontent_player: {
				siteId: '462802',
				sizeId: '203',
				zoneId: '2742534',
			},
		},
	};

	const mobileSlots = {
		slots: {
			featured: {
				siteId: '462804',
				sizeId: '201',
				zoneId: '2742536',
			},
			incontent_player: {
				siteId: '462804',
				sizeId: '203',
				zoneId: '2742536',
			},
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
