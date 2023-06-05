export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720056',
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462846',
			zoneId: ['2720064', '2720056'],
		},
		top_boxad: {
			sizes: [[300, 250]],
			siteId: '462846',
			zoneId: '2720060',
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			siteId: '462848',
			zoneId: '2720078',
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
			siteId: '462848',
			zoneId: '2720074',
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: ['2720062', '2720078'],
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
			siteId: '462848',
			zoneId: ['2720080', '2720078'],
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
