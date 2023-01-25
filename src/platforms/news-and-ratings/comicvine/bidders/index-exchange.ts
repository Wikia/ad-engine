export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['933457', '933461'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['933458', '933459'],
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: ['933462'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			siteId: ['933460'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: ['934635'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: ['934637'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			siteId: ['934639'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			siteId: ['934640'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			siteId: ['934641'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['934642', '934643'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			siteId: ['934644'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['934645', '934647'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['934648', '934649'],
		},
		'mobile-banner': {
			sizes: [[300, 250]],
			siteId: ['934650'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
