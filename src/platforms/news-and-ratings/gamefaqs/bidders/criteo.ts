export function getCriteoContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
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
		mpu_top: {
			sizes: [[300, 250]],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
		},
		leader_bottom: {
			sizes: [[728, 90]],
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
		},
	};
	const mobileSlots = {
		'mobile-native-top': {
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
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-native-plus-top': {
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
		'mobile-banner': {
			sizes: [[320, 50]],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
		},
	};

	return {
		enabled: false,
		networkId: 3306,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
