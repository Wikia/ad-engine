export function getMagniteS2sContext(isDesktop: boolean): object {
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
		'skybox-nav': {
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
		'mobile-skybox-nav': {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
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
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
