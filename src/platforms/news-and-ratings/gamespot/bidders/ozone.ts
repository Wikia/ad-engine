export function getOzoneContext(isDesktop: boolean): object {
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
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-ad-inc': {
			sizes: [[300, 250]],
		},
		'mobile-flex-inc': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-plus': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-ad': {
			sizes: [[300, 250]],
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [[300, 250]],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
		},
		'mobile-flex-bottom': {
			sizes: [[300, 250]],
		},
		'mobile-autoplay-plus': {
			sizes: [[300, 250]],
		},
		'mobile-highimpact-plus': {
			sizes: [[300, 250]],
		},
		'incontent-mobile-flex': {
			sizes: [[300, 250]],
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
		},
	};
	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
