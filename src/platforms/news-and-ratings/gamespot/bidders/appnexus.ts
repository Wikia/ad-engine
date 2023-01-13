export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574424'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementId: ['28574425', '28574432'],
		},
		mpu_middle: {
			sizes: [[300, 250]],
			placementId: ['28574426'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: ['28574427'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			placementId: ['28574428'],
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			placementId: ['28574429'],
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			placementId: ['28574430'],
		},
		'native-mpu': {
			sizes: [[300, 250]],
			placementId: ['28574431'],
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574433', '28574447'],
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574434', '28574450'],
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
			placementId: ['28574435'],
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574436', '28574451'],
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574437', '28574452'],
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574438', '28574453'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574439', '28574448'],
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574440'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			placementId: ['28574441'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574442'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			placementId: ['28574443'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574444', '28574449'],
		},
		'incontent-ad': {
			sizes: [[728, 90]],
			placementId: ['28574445'],
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
			placementId: ['28574446'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			placementId: ['28574454'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: ['28574455'],
		},
		'mobile-incontent-ad-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574456', '28574483'],
		},
		'mobile-flex-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574457', '28574471'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574458', '28574473'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574459', '28574474'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574460', '28574470'],
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			placementId: ['28574461'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			placementId: ['28574462'],
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574463', '28574476'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			placementId: ['28574464'],
		},
		'mobile-flex-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574465', '28574477'],
		},
		'mobile-autoplay-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574466', '28574478'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574467', '28574479'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574468', '28574480'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574469', '28574482'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			placementId: ['28574472'],
		},
		'mobile-banner-bottom': {
			sizes: [[320, 50]],
			placementId: ['28574475'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			placementId: ['28574481'],
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
			placementId: ['28574484'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574485', '28574487'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			placementId: ['28574486'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
