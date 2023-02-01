export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			placementId: '_uAtUAaayo0',
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			placementId: '_uAtUAaayo0',
		},
		'incontent-leader-plus-bottom': {
			sizes: [[728, 90]],
			placementId: '_uAtUAaayo0',
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			placementId: '_pC1SeRWmK7',
		},
		'mpu-top': {
			sizes: [[300, 250]],
			placementId: '_pC1SeRWmK7',
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
	};

	const mobileSlots = {
		'mobile-banner-plus': {
			sizes: [[320, 50]],
			placementId: '_pC1SeRWmK7',
		},
		'mobile-incontent-plus': {
			sizes: [[300, 250]],
			placementId: '_pC1SeRWmK7',
		},
		'mobile-incontent-plus-bottom': {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
