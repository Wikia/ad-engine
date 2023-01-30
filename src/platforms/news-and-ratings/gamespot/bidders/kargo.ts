export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementIds: ['_rXEPrtrFI5', '_jiHQTggPyr'],
		},
		mpu_middle: {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		'native-mpu': {
			sizes: [[300, 250]],
			placementId: '_rXEPrtrFI5',
		},
		'leader-ad-plus-top': {
			sizes: [[728, 90]],
			placementId: '_bVgnU39GXb',
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: '_bVgnU39GXb',
		},
		leader_bottom: {
			sizes: [[728, 90]],
			placementId: '_bVgnU39GXb',
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			placementId: '_bVgnU39GXb',
		},
		'sky-leader-plus-top': {
			sizes: [[728, 90]],
			placementId: '_bVgnU39GXb',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-incontent-ad-inc': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-flex-bottom': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-autoplay-plus': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-highimpact-plus': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'incontent-mobile-flex': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			placementId: '_mv6ZSXDVpo',
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
			placementId: '_bVgnU39GXb',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
