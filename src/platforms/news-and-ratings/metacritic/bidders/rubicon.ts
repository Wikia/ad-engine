export function getRubiconContext(isDesktop: boolean): object {
	const desktopSlots = {
		video: {
			siteId: '462846',
			zoneId: '2742556',
		},
	};

	const mobileSlots = {
		video: {
			siteId: '462848',
			zoneId: '2742558',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
