export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			siteId: '462802',
			zoneId: '2719686',
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462802',
			zoneId: '2719688',
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: '462802',
			zoneId: '2719690',
		},
		mpu_top: {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719692',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: '462802',
			zoneId: '2719694',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: '462802',
			zoneId: '2719696',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: '462802',
			zoneId: '2719698',
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
			siteId: '462802',
			zoneId: '2719822',
		},
	};

	const mobileSlots = {
		'mobile-native-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719700',
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719702',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719704',
		},
		'mobile-native-plus-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719706',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719780',
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719782',
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			siteId: '462804',
			zoneId: '2719784',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: '462804',
			zoneId: '2719786',
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			siteId: '462804',
			zoneId: '2719788',
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719790',
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719792',
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462804',
			zoneId: '2719794',
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
			siteId: '462804',
			zoneId: '2719796',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
