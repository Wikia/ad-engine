export function getCriteoContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
		mpu_middle: {
			sizes: [[300, 250]],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
		},
		'native-mpu': {
			sizes: [[300, 250]],
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		leader_top: {
			sizes: [[728, 90]],
		},
		leader_bottom: {
			sizes: [[728, 90]],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
		},
		leader_middle: {
			sizes: [[728, 90]],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'incontent-ad': {
			sizes: [[728, 90]],
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-ad-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-flex-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
		},
		'mobile-flex-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-autoplay-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
		},
		'mobile-banner-bottom': {
			sizes: [[320, 50]],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
		},
	};

	return {
		enabled: false,
		networkId: 3306,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
