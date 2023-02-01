export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e3f77e00c8', '8a9691e7018585a630eba7e3f88300c8'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e3f9aa00d6', '8a969dc9018585a62bdba7e3fac900c9'],
		},
		leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4072400cd'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e3fcf500ca'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e3fe0a00d7'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e3ff2300ca'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4003b00cb'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e4014f00d8'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e40eb100cf'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e40fc000dc', '8a969dc9018585a62bdba7e410b500cf'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e411b300d0'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e412a300dd', '8a969dc9018585a62bdba7e413a100d0'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e414c400d1', '8a969450018585a63429a7e415da00de'],
		},
		'mobile-banner': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e4171f00d1'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
