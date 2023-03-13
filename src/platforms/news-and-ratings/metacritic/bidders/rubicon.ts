export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		slots: {
			featured: {
				siteId: '462846',
				sizeId: '201',
				zoneId: '2742556',
			},
			incontent_player: {
				siteId: '462846',
				sizeId: '203',
				zoneId: '2742556',
			},
		},
	};

	const mobileSlots = {
		slots: {
			featured: {
				siteId: '462848',
				sizeId: '201',
				zoneId: '2742558',
			},
			incontent_player: {
				siteId: '462848',
				sizeId: '203',
				zoneId: '2742558',
			},
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
