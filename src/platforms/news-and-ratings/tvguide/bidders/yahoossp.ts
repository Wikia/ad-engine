export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e5466a0118'],
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e547610145'],
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e5484f0124'],
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e5494a0119'],
		},
		'incontent-ad-plus-top': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e577c40131'],
		},
		'incontent-ad-plus-middle': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e54b450125'],
		},
		'incontent-ad-plus-bottom': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e54c4f011a'],
		},
		'leader-top': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e57c460132'],
		},
		'leader-inc': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e54e8b0126'],
		},
		'leader-middle': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e54f9e011b'],
		},
		'leader-middle2': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e581760133'],
		},
		'leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a9691e7018585a630eba7e5831e0129', '8a9691e7018585a630eba7e552f7011c'],
		},
		'leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e554080128', '8a9691e7018585a630eba7e587bf012a'],
		},
		'leaderboard-top': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e556810149'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e58af30135'],
		},
		'leaderboard-middle2': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e58cb9012b'],
		},
		'leaderboard-inc': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e559da0129'],
		},
		'leaderboard-bottom': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e55b10011f'],
		},
		'incontent-leader-middle': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e55c36012a'],
		},
		'incontent-leader-inc': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e55d770120'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e595a70137', '8a969dc9018585a62bdba7e55fb9012b'],
		},
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a9691e7018585a630eba7e561070121', '8a969450018585a63429a7e56234014c'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e56358012c', '8a9691e7018585a630eba7e564ac0122'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e565eb014d'],
		},
		'incontent-leaderboard-middle': {
			sizes: [[728, 90]],
			pubId: ['8a969dc9018585a62bdba7e5671c012d'],
		},
		'incontent-leaderboard-inc': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e568af0123'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e56a04014e'],
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			pubId: ['8a969dc9018585a62bdba7e56b40012e', '8a9691e7018585a630eba7e56cb80124'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e56e14014f'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e56f57012f'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e570d80125'],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-sticky': {
			sizes: [[320, 50]],
			pubId: ['8a9691e7018585a630eba7e5b1a30131'],
		},
		'mobile-omni-plus-sticky': {
			sizes: [[320, 50]],
			pubId: ['8a969450018585a63429a7e5b2ad015d'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e5b399013d'],
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e5b49c0132'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e5b5c3015e', '8a969dc9018585a62bdba7e5b6e7013e'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e5b7e90133', '8a969450018585a63429a7e5b8ec015f'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969dc9018585a62bdba7e5b9f2013f', '8a9691e7018585a630eba7e5bafd0134'],
		},
		'mobile-incontent-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a969450018585a63429a7e5bbfe0160', '8a969dc9018585a62bdba7e5bcf70140'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			pubId: ['8a9691e7018585a630eba7e5be1e0135'],
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e5b399013d'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969dc9018585a62bdba7e5c03f0141', '8a9691e7018585a630eba7e5c16a0136'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			pubId: ['8a9691e7018585a630eba7e5b49c0132'],
		},
		'mobile-incontent-mpu-plus-inc': {
			sizes: [[300, 250]],
			pubId: ['8a969dc9018585a62bdba7e5c3a70142'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			pubId: ['8a9691e7018585a630eba7e5c4dd0137'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
