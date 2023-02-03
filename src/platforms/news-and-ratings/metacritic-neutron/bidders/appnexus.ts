export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			placementId: ['28574573'],
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			placementId: ['28574575'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
			placementId: ['28574580', '28574583'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			placementId: ['28574583'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574579', '28574574'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			placementId: ['28574581'],
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			placementId: ['28574576'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			placementId: ['28574578'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			placementId: ['28574589'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			placementId: ['28574591'],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
			placementId: ['28574586'],
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			placementId: ['28574588', '28574576'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574578', '28574590'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			placementId: ['28574592', '28574589'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			placementId: ['28574582'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
