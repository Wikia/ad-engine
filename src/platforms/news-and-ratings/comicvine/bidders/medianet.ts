export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['168590768', '944158720'],
			cid: '8CU5JOKX4',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['168590768', '944158720'],
			cid: '8CU5JOKX4',
		},
		leader_top: {
			sizes: [[728, 90]],
			crid: ['168590768'],
			cid: '8CU5JOKX4',
		},
		mpu_top: {
			sizes: [[300, 250]],
			crid: ['252110547'],
			cid: '8CU5JOKX4',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			crid: ['252110547'],
			cid: '8CU5JOKX4',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			crid: ['168590768'],
			cid: '8CU5JOKX4',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			crid: ['168590768'],
			cid: '8CU5JOKX4',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			crid: ['252110547'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			crid: ['333661052'],
			cid: '8CU5JOKX4',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['333661052', '541592785'],
			cid: '8CU5JOKX4',
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			crid: ['333661052'],
			cid: '8CU5JOKX4',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['333661052', '541592785'],
			cid: '8CU5JOKX4',
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['333661052', '541592785'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner': {
			sizes: [[300, 250]],
			crid: ['541592785'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
