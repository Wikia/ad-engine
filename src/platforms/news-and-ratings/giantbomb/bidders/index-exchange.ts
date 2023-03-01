export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936254', '936255'],
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: ['936256'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			siteId: ['936257'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: ['936258'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: ['936259'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			siteId: ['936260'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			siteId: ['936261'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936262', '936263'],
		},
		video: {
			siteId: '936612',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			siteId: ['936264'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936265', '936266'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936267', '936268'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936269', '936270'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			siteId: ['936271'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936272', '936273'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: ['936274'],
		},
		video: {
			siteId: '936613',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
