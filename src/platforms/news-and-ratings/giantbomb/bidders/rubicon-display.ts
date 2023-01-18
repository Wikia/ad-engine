export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462834',
			zoneId: '2719962',
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: '462834',
			zoneId: '2719964',
		},
		mpu_top: {
			sizes: [[300, 250]],
			siteId: '462834',
			zoneId: '2719966',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: '462834',
			zoneId: '2719968',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: '462834',
			zoneId: '2719970',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			siteId: '462834',
			zoneId: '2719972',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			siteId: '462834',
			zoneId: '2719974',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462834',
			zoneId: '2719976',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			siteId: '462836',
			zoneId: '2719978',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462836',
			zoneId: '2719980',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462836',
			zoneId: '2719982',
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462836',
			zoneId: '2719984',
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			siteId: '462836',
			zoneId: '2719986',
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462836',
			zoneId: '2719988',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: '462836',
			zoneId: '2719990',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
