export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: '_xqQ14ARb3g',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: '_xqQ14ARb3g',
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: '_xqQ14ARb3g',
		},
		mpu_top: {
			sizes: [[300, 250]],
			placementId: '_mBGDhmVyOO',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: '_mBGDhmVyOO',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			placementId: '_mBGDhmVyOO',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			placementId: '_p2zL4d8atf',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: '_p2zL4d8atf',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: '_p2zL4d8atf',
		},
		'incontent-mobile-flex': {
			sizes: [[300, 250]],
			placementId: '_p2zL4d8atf',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
