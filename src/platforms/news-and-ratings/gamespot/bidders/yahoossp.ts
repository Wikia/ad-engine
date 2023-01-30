export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e4471900ee'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			pubId: ['8a969450018585a63429a7e4480400ef', '8a969450018585a63429a7e44eb400f6'],
		},
		mpu_middle: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e448fa00f0'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e449e300f1'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e44ad500f2'],
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e44bcc00f3'],
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e44cc600f4'],
		},
		'native-mpu': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e44db500f5'],
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e44faa00f7', '8a969450018585a63429a7e461500105'],
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e450af00f8', '8a969450018585a63429a7e464be0108'],
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e4520500f9'],
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e4536400fa', '8a969450018585a63429a7e465f00109'],
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e4561c00fb', '8a9691e7018585a630eba7e4673b00db'],
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e4575800fc', '8a969450018585a63429a7e4687f010a'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e4588500fd', '8a969450018585a63429a7e4626c0106'],
		},
		leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e4599600fe'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e45aab00ff'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e45bbc0100'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e45cd80101'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e45df90102', '8a969450018585a63429a7e463910107'],
		},
		'incontent-ad': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e45f130103'],
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e460300104'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e4992200f0'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e49a0f0116'],
		},
		'mobile-incontent-ad-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e49b0200e5', '8a969450018585a63429a7e4ba20011c'],
		},
		'mobile-flex-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e49c0300f1', '8a969dc9018585a62bdba7e4ab0100f7'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e49cf80117', '8a9691e7018585a630eba7e4ad9c00ec'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e49df800e6', '8a969dc9018585a62bdba7e4aed400f8'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e49efd00f2', '8a9691e7018585a630eba7e4a9d500eb'],
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e4a00300e7'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e4a32f00f4'],
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e4a10a00f3', '8a9691e7018585a630eba7e4b13a00ed'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e4a22100e8'],
		},
		'mobile-flex-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e4a44700e9', '8a969dc9018585a62bdba7e4b27c00f9'],
		},
		'mobile-autoplay-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e4a55600f5', '8a9691e7018585a630eba7e4b3d000ee'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e4a6630118', '8a969dc9018585a62bdba7e4b50100fa'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e4a79100ea', '8a969450018585a63429a7e4b636011b'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e4a8b100f6', '8a969dc9018585a62bdba7e4b8e300fb'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			pubId: ['8a969450018585a63429a7e4ac530119'],
		},
		'mobile-banner-bottom': {
			sizes: [[320, 50]],
			pubId: ['8a969450018585a63429a7e4aff4011a'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			pubId: ['8a9691e7018585a630eba7e4b7a100ef'],
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4bb7e00f0'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e4bcbe00fc', '8a9691e7018585a630eba7e4bf7700f1'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e4bdfe011d'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
