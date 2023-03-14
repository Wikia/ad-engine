export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			siteId: '462834',
			zoneId: '2742544',
		},
	};

	const mobileSlots = {
		video: {
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
