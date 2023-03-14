export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		slots: {
			featured: {
				siteId: '462834',
				sizeId: '201',
				zoneId: '2742544',
			},
			incontent_player: {
				siteId: '462834',
				sizeId: '203',
				zoneId: '2742544',
			},
		},
	};

	const mobileSlots = {
		slots: {
			featured: {
				siteId: '462836',
				sizeId: '201',
				zoneId: '2742550',
			},
			incontent_player: {
				siteId: '462836',
				sizeId: '203',
				zoneId: '2742550',
			},
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
