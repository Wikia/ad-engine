export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e4ff400130', '8a969dc9018585a62bdba7e50025010f'],
		},
		leader_top: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e5011b0105'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			pubId: ['8a969450018585a63429a7e5021b0131', '8a969dc9018585a62bdba7e5030d0110'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e504170106'],
		},
		leader_bottom: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e505390132', '8a969dc9018585a62bdba7e506430111'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e507500107'],
		},
		leader_middle2: {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e508730133'],
		},
		incontent_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e5098f0112', '8a9691e7018585a630eba7e50ae40108'],
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e51a81010b', '8a969450018585a63429a7e51b710139'],
		},
		mobile_incontent_plus_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e51c4d0118', '8a9691e7018585a630eba7e51d4b010c'],
		},
		mobile_banner_plus_middle: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e51e7e013a', '8a969dc9018585a62bdba7e51faf0119'],
		},
		mobile_incontent_plus_middle2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e52111010d', '8a969450018585a63429a7e5227f013b'],
		},
		mobile_mpu_banner_bottom: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e52392011a', '8a9691e7018585a630eba7e524b2010e'],
		},
		mobile_gallery_banner_plus_1: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e525b8013c', '8a969dc9018585a62bdba7e526c2011b'],
		},
		mobile_gallery_banner_plus_2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e527e8010f', '8a969450018585a63429a7e528fa013d'],
		},
		mobile_gallery_banner_plus_3: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e529f9011c', '8a9691e7018585a630eba7e52b250110'],
		},
		mobile_gallery_banner_plus_4: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e52c3b013e', '8a969dc9018585a62bdba7e52d46011d'],
		},
		mobile_gallery_banner_plus_5: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e52e8c0111', '8a969450018585a63429a7e52fa6013f'],
		},
		mobile_gallery_banner_plus_6: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e530bf011e', '8a9691e7018585a630eba7e532110112'],
		},
		mobile_gallery_banner_plus_7: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e533320140', '8a9691e7018585a630eba7e5347d0113'],
		},
		mobile_gallery_banner_plus_8: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e535b60141', '8a969dc9018585a62bdba7e53703011f'],
		},
		mobile_gallery_banner_plus_9: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e538860114', '8a969450018585a63429a7e539c60142'],
		},
		mobile_gallery_banner_plus_10: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e53af30120', '8a9691e7018585a630eba7e53c540115'],
		},
		mobile_gallery_banner_plus_11: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e53d8e0143', '8a969dc9018585a62bdba7e53ec80121'],
		},
		mobile_gallery_banner_plus_12: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e5403b0116', '8a969450018585a63429a7e5417f0144'],
		},
		mobile_gallery_banner_plus_13: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e542bc0122', '8a9691e7018585a630eba7e544280117'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			pubId: ['8a969dc9018585a62bdba7e545760123'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
