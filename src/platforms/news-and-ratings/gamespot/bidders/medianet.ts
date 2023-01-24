export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			crid: ['229365319', '927431096'],
			cid: '8CU5JOKX4',
		},
		mpu_middle: {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		'native-mpu': {
			sizes: [[300, 250]],
			crid: ['229365319'],
			cid: '8CU5JOKX4',
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		leader_top: {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
		leader_middle: {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['832473955', '510533100'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad': {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
			crid: ['832473955'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			crid: ['125180983'],
			cid: '8CU5JOKX4',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			crid: ['125180983'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-ad-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-flex-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			crid: ['125180983'],
			cid: '8CU5JOKX4',
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			crid: ['125180983'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			crid: ['125180983'],
			cid: '8CU5JOKX4',
		},
		'mobile-flex-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-autoplay-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['125180983', '250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			crid: ['250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-bottom': {
			sizes: [[320, 50]],
			crid: ['250621178'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			crid: ['250621178'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
			crid: ['524179438'],
			cid: '8CU5JOKX4',
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['524179438', '615107631'],
			cid: '8CU5JOKX4',
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			crid: ['524179438'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
