export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			siteId: ['936116'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936117', '936118'],
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: ['936119'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			siteId: ['936120'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: ['936121', '936122'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: ['936123'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: ['936124'],
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
			siteId: ['936139'],
		},
	};

	const mobileSlots = {
		'mobile-native-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936125', '936126'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936127', '936128'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936129', '936130'],
		},
		'mobile-native-plus-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936131', '936132'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936133', '936134'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936135', '936136'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			siteId: ['936137'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: ['936138'],
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			siteId: ['936140'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936141', '936142'],
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936143', '936144'],
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936145', '936146'],
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
			siteId: ['936147'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
