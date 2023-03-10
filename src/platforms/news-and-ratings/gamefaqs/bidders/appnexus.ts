export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			placementId: ['28574380'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574381', '28574382'],
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574383'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574384'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementId: ['28574385', '28574386'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: ['28574387'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			placementId: ['28574388'],
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
			placementId: ['28574403'],
		},
		video: {
			siteId: '29038681',
		},
	};

	const mobileSlots = {
		'mobile-native-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574389', '28574390'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574391', '28574392'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574393', '28574394'],
		},
		'mobile-native-plus-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574395', '28574396'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574397', '28574398'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574399', '28574400'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			placementId: ['28574401'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: ['28574402'],
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			placementId: ['28574404'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574405', '28574406'],
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574407', '28574408'],
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574409', '28574410'],
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
			placementId: ['28574411'],
		},
		video: {
			siteId: '29038704',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
