export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			crid: ['342310474'],
			cid: '8CU5JOKX4',
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['342310474', '327181244'],
			cid: '8CU5JOKX4',
		},
		leader_top: {
			sizes: [[728, 90]],
			crid: ['342310474'],
			cid: '8CU5JOKX4',
		},
		mpu_top: {
			sizes: [[300, 250]],
			crid: ['785582676'],
			cid: '8CU5JOKX4',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			crid: ['785582676', '633655848'],
			cid: '8CU5JOKX4',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			crid: ['785582676'],
			cid: '8CU5JOKX4',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			crid: ['342310474'],
			cid: '8CU5JOKX4',
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
			crid: ['342310474'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		'mobile-native-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-native-plus-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			crid: ['479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			crid: ['150218268'],
			cid: '8CU5JOKX4',
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			crid: ['479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['150218268', '479508368'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
			crid: ['173604207'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
