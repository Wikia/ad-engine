export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e4ff400130'],
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e5011b0105'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e505390132', '8a969dc9018585a62bdba7e50025010f'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e507500107'],
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e5021b0131'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e504170106'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e51e7e013a'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e52111010d'],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
			pubId: ['8a969450018585a63429a7e51b710139'],
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			pubId: ['8a9691e7018585a630eba7e51d4b010c', '8a969450018585a63429a7e5021b0131'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e504170106', '8a969dc9018585a62bdba7e51faf0119'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			pubId: ['8a969450018585a63429a7e5227f013b', '8a969450018585a63429a7e51e7e013a'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e508730133'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
			pubId: ['8a969dc9018585a62bdba7e506430111', '8a969dc9018585a62bdba7e5098f0112'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e5098f0112'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
