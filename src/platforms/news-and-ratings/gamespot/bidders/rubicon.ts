export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		slots: {
			featured: {
				siteId: '462828',
				sizeId: '201',
				zoneId: '2742538',
			},
			incontent_player: {
				siteId: '462828',
				sizeId: '203',
				zoneId: '2742538',
			},
		},
	};

	const mobileSlots = {
		slots: {
			featured: {
				siteId: '462830',
				sizeId: '201',
				zoneId: '2742540',
			},
			incontent_player: {
				siteId: '462830',
				sizeId: '203',
				zoneId: '2742540',
			},
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
