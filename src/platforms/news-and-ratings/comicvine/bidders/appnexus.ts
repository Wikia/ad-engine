export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574351', '28574352'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574353', '28574354'],
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574355'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574356'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: ['28574357'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			placementId: ['28574358'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574359'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574360'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			placementId: ['28574361'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574362', '28574363'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			placementId: ['28574364'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574365', '28574366'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574367', '28574368'],
		},
		'mobile-banner': {
			sizes: [[300, 250]],
			placementId: ['28574369'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
