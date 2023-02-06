export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720056',
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720058',
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
			siteId: '462846',
			zoneId: ['2720064', '2720070'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720070',
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462846',
			zoneId: ['2720064', '2720056'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720066',
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			siteId: '462846',
			zoneId: '2720060',
		},
		'mpu-top': {
			sizes: [[300, 250]],
			siteId: '462846',
			zoneId: '2720062',
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			siteId: '462848',
			zoneId: '2720078',
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			siteId: '462848',
			zoneId: '2720080',
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
			siteId: '462848',
			zoneId: '2720074',
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			siteId: '462848',
			zoneId: ['2720076', '2720060'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: ['2720062', '2720078'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			siteId: '462848',
			zoneId: ['2720080', '2720078'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720068',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
