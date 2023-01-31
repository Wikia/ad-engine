export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e4c06700fd', '8a969450018585a63429a7e4c154011e'],
		},
		leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4c26f00f2'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e4c3a800fe'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e4c4d1011f'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4c5d300f3'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e4c6d900ff'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e4c7d00120'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a9691e7018585a630eba7e4c8dd00f4', '8a969dc9018585a62bdba7e4c9f10100'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e4d6180124'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e4d71c0103', '8a9691e7018585a630eba7e4d83d00fa'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e4d9780125', '8a969dc9018585a62bdba7e4daad0104'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e4dbf300fb', '8a969450018585a63429a7e4dd080126'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			pubId: ['8a969dc9018585a62bdba7e4de0f0105'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e4df3200fc', '8a969450018585a63429a7e4e04e0127'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e4e16c0106'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
