export function getCriteoContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'sky-leader-plus-top': {
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
		mpu_bottom: {
			sizes: [[300, 250]],
		},
		leader_bottom: {
			sizes: [[728, 90]],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
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
			sizes: [[300, 250]],
		},
	};

	return {
		enabled: false,
		networkId: 3306,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
