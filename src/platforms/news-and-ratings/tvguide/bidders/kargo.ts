export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			placementId: '_cdiEFHdawz',
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			placementId: '_cdiEFHdawz',
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			placementId: '_cdiEFHdawz',
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			placementId: '_cdiEFHdawz',
		},
		'leader-top': {
			sizes: [[728, 90]],
			placementId: '_cdiEFHdawz',
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementIds: ['_k2DaJyM0HX', '_uBlNGOzrJP'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			placementId: '_k2DaJyM0HX',
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			placementId: '_k2DaJyM0HX',
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			placementId: '_k2DaJyM0HX',
		},
	};

	const mobileSlots = {
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: '_hRHWLyyJiL',
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			placementId: '_hRHWLyyJiL',
		},
		'mobile-banner-plus-inc': {
			sizes: [[300, 250]],
			placementId: '_hRHWLyyJiL',
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			placementId: '_hRHWLyyJiL',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
