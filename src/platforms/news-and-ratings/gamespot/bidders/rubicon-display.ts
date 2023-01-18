export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719686',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: '462802',
			zoneId: '2719688',
		},
		mpu_middle: {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719688',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719690',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719692',
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719694',
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719694',
		},
		'native-mpu': {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719696',
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719700',
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719700',
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719702',
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719702',
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719704',
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719704',
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719706',
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719706',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719780',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719780',
		},
		leader_middle: {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719782',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462804',
			zoneId: '2719782',
		},
		'incontent-ad': {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719784',
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719786',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			siteId: '462804',
			zoneId: '2719794',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: '462804',
			zoneId: '2719796',
		},
		'mobile-incontent-ad-inc': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719798',
		},
		'mobile-flex-inc': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719800',
		},
		'mobile-incontent-plus': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719802',
		},
		'mobile-incontent-plus-bottom': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719802',
		},
		'mobile-incontent-ad': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719804',
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719806',
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719808',
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719808',
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719810',
		},
		'mobile-flex-bottom': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719812',
		},
		'mobile-autoplay-plus': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719814',
		},
		'mobile-highimpact-plus': {
			sizes: [[300, 250]],
			siteId: '462824',
			zoneId: '2719798',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
