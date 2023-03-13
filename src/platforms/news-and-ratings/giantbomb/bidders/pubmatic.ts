export function getPubmaticContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856927', '4856928'],
		},
		leader_top: {
			sizes: [[728, 90]],
			ids: ['4856929'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			ids: ['4856930'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			ids: ['4856931'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			ids: ['4856932'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			ids: ['4856933'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			ids: ['4856934'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856935', '4856936'],
		},
		video: {
			ids: ['4923776'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			ids: ['4856937'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856938', '4856939'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856940', '4856941'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856942', '4856943'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			ids: ['4856944'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856945', '4856946'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			ids: ['4856947'],
		},
		video: {
			ids: ['4923777'],
		},
	};

	return {
		enabled: false,
		publisherId: '156260',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
