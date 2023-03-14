export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			siteId: '462828',
			zoneId: '2742538',
		},
	};

	const mobileSlots = {
		video: {
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
