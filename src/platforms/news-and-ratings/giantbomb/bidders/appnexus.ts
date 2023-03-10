export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574518', '28574519'],
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574520'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574521'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: ['28574522'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			placementId: ['28574523'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574524'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574525'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574526', '28574527'],
		},
		video: {
			siteId: '29038862',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			placementId: ['28574528'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574529', '28574530'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574531', '28574532'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574533', '28574534'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			placementId: ['28574535'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574536', '28574537'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: ['28574538'],
		},
		video: {
			siteId: '29038899',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
