export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_top: {
			sizes: [[300, 250]],
			siteId: ['936160'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: ['936161', '936168'],
		},
		mpu_middle: {
			sizes: [[300, 250]],
			siteId: ['936162'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: ['936163'],
		},
		overlay_mpu_top: {
			sizes: [[300, 250]],
			siteId: ['936164'],
		},
		'mpu-top-inc': {
			sizes: [[300, 250]],
			siteId: ['936165'],
		},
		'mpu-bottom-inc': {
			sizes: [[300, 250]],
			siteId: ['936166'],
		},
		'native-mpu': {
			sizes: [[300, 250]],
			siteId: ['936167'],
		},
		'nav-ad-plus-leader': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936169', '936183'],
		},
		'leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936170', '936186'],
		},
		'leader-bottom-inc': {
			sizes: [[728, 90]],
			siteId: ['936171'],
		},
		'leader-ad-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936172', '936187'],
		},
		'leader-ad-plus-middle': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936173', '936188'],
		},
		'incontent-ad-plus-billboard-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936174', '936189'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936175', '936184'],
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: ['936176'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			siteId: ['936177'],
		},
		overlay_leader_top: {
			sizes: [[728, 90]],
			siteId: ['936178'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			siteId: ['936179'],
		},
		'sky-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936180', '936185'],
		},
		'incontent-ad': {
			sizes: [[728, 90]],
			siteId: ['936181'],
		},
		'incontent-ad-inc': {
			sizes: [[728, 90]],
			siteId: ['936182'],
		},
		video: {
			siteId: '936614',
		},
	};

	const mobileSlots = {
		'mobile-native': {
			sizes: [[300, 250]],
			siteId: ['936190'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: ['936191'],
		},
		'mobile-incontent-ad-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936192', '936219'],
		},
		'mobile-flex-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936193', '936207'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936194', '936209'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936195', '936210'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936196', '936206'],
		},
		'mobile-mpu-bottom': {
			sizes: [[300, 250]],
			siteId: ['936197'],
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			siteId: ['936198'],
		},
		'mobile-incontent-ad-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936199', '936212'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			siteId: ['936200'],
		},
		'mobile-flex-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936201', '936213'],
		},
		'mobile-autoplay-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936202', '936214'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936203', '936215'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936204', '936216'],
		},
		'mobile-banner-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936205', '936218'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			siteId: ['936208'],
		},
		'mobile-banner-bottom': {
			sizes: [[320, 50]],
			siteId: ['936211'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			siteId: ['936217'],
		},
		'incontent-ad-plus-inc': {
			sizes: [[728, 90]],
			siteId: ['936220'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936221', '936223'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			siteId: ['936222'],
		},
		video: {
			siteId: '936615',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
