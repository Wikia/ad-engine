export function getCriteoContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
		},
		'mpu-top': {
			sizes: [[300, 250]],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
		},
	};

	return {
		enabled: false,
		networkId: 3306,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
