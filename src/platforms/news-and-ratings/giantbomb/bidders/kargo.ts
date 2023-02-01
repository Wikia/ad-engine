export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: '_cYu48lzA6c',
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: '_cYu48lzA6c',
		},
		mpu_top: {
			sizes: [[300, 250]],
			placementId: '_onjs9KihI8',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: '_onjs9KihI8',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			placementId: '_cYu48lzA6c',
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: '_cYu48lzA6c',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			placementId: '_o4Eb0OhQnq',
		},
		'mobile-mpu-banner-bottom': {
			sizes: [[300, 250]],
			placementId: '_o4Eb0OhQnq',
		},
		'mobile-highimpact-plus': {
			sizes: [[300, 250]],
			placementId: '_o4Eb0OhQnq',
		},
		'incontent-mobile-flex': {
			sizes: [[300, 250]],
			placementId: '_o4Eb0OhQnq',
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			placementId: '_o4Eb0OhQnq',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: '_o4Eb0OhQnq',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
