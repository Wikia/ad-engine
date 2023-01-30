export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4182100d2'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e4191f00df', '8a969dc9018585a62bdba7e41a0b00d2'],
		},
		leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e41b0a00d3'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e41c0800e0'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			pubId: ['8a9691e7018585a630eba7e41d1800d4', '8a969dc9018585a62bdba7e41e0700d3'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e41ef000e1'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e41ffb00d5'],
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e4210700d4'],
		},
	};

	const mobileSlots = {
		'mobile-native-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e42fb300e4', '8a969dc9018585a62bdba7e4309700dd'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e4318c00de', '8a969dc9018585a62bdba7e4327f00df'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e4337c00e5', '8a969dc9018585a62bdba7e4347000e0'],
		},
		'mobile-native-plus-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e4356100e6', '8a969dc9018585a62bdba7e4365a00e1'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e4375900e7', '8a969dc9018585a62bdba7e4386600e2'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e4398200e8', '8a969dc9018585a62bdba7e43a9e00e3'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			pubId: ['8a9691e7018585a630eba7e43bed00d8'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e43d2800e9'],
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			pubId: ['8a969450018585a63429a7e43e3e00ea'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e43f5700eb', '8a969450018585a63429a7e4406c00ec'],
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e4418400e4', '8a9691e7018585a630eba7e442b500d9'],
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e443d000ed', '8a969dc9018585a62bdba7e444ea00e5'],
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e4462900da'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
