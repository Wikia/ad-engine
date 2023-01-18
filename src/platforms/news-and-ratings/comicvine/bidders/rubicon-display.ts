export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462616',
			zoneId: '2718878',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462616',
			zoneId: '2718880',
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: '462616',
			zoneId: '2718882',
		},
		mpu_top: {
			sizes: [[300, 250]],
			siteId: '462616',
			zoneId: '2718884',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: '462616',
			zoneId: '2718886',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: '462616',
			zoneId: '2718888',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			siteId: '462616',
			zoneId: '2718890',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			siteId: '462616',
			zoneId: '2718892',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			siteId: '462618',
			zoneId: '2718894',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462618',
			zoneId: '2718900',
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			siteId: '462618',
			zoneId: '2718908',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462618',
			zoneId: '2718914',
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462618',
			zoneId: '2718920',
		},
		'mobile-banner': {
			sizes: [[300, 250]],
			siteId: '462618',
			zoneId: '2718922',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
