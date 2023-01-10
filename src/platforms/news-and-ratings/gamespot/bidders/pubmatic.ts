export function getPubmaticContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			ids: ['4856863'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			ids: ['4856864', '4856871'],
		},
		mpu_middle: {
			sizes: [[300, 250]],
			ids: ['4856865'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			ids: ['4856866'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			ids: ['4856867'],
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			ids: ['4856868'],
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			ids: ['4856869'],
		},
		'native-mpu': {
			sizes: [[300, 250]],
			ids: ['4856870'],
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856872', '4856886'],
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856873', '4856889'],
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
			ids: ['4856874'],
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856875', '4856890'],
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856876', '4856891'],
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856877', '4856892'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856878', '4856887'],
		},
		leader_top: {
			sizes: [[728, 90]],
			ids: ['4856879'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			ids: ['4856880'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			ids: ['4856881'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			ids: ['4856882'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856883', '4856888'],
		},
		'incontent-ad': {
			sizes: [[728, 90]],
			ids: ['4856884'],
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
			ids: ['4856885'],
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			ids: ['4856893'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			ids: ['4856894'],
		},
		'mobile-incontent-ad-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856895', '4856922'],
		},
		'mobile-flex-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856896', '4856910'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856897', '4856912'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856898', '4856913'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856899', '4856909'],
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			ids: ['4856900'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			ids: ['4856901'],
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856902', '4856915'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			ids: ['4856903'],
		},
		'mobile-flex-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856904', '4856916'],
		},
		'mobile-autoplay-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856905', '4856917'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856906', '4856918'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856907', '4856919'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856908', '4856921'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			ids: ['4856911'],
		},
		'mobile-banner-bottom': {
			sizes: [[320, 50]],
			ids: ['4856914'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			ids: ['4856920'],
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
			ids: ['4856923'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856924', '4856926'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			ids: ['4856925'],
		},
	};

	return {
		enabled: false,
		publisherId: '156260',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
