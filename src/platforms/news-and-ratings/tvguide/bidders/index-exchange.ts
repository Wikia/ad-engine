export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			siteId: ['936370'],
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			siteId: ['936371'],
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			siteId: ['936372'],
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			siteId: ['936373'],
		},
		'incontent-ad-plus-top': {
			sizes: [[728, 90]],
			siteId: ['936374'],
		},
		'incontent-ad-plus-middle': {
			sizes: [[728, 90]],
			siteId: ['936375'],
		},
		'incontent-ad-plus-bottom': {
			sizes: [[728, 90]],
			siteId: ['936376'],
		},
		'leader-top': {
			sizes: [[728, 90]],
			siteId: ['936377'],
		},
		'leader-inc': {
			sizes: [[728, 90]],
			siteId: ['936378'],
		},
		'leader-middle': {
			sizes: [[728, 90]],
			siteId: ['936379'],
		},
		'leader-middle2': {
			sizes: [[728, 90]],
			siteId: ['936380'],
		},
		'leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936381', '936382'],
		},
		'leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936383', '936384'],
		},
		'leaderboard-top': {
			sizes: [[728, 90]],
			siteId: ['936385'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			siteId: ['936386'],
		},
		'leaderboard-middle2': {
			sizes: [[728, 90]],
			siteId: ['936387'],
		},
		'leaderboard-inc': {
			sizes: [[728, 90]],
			siteId: ['936388'],
		},
		'leaderboard-bottom': {
			sizes: [[728, 90]],
			siteId: ['936389'],
		},
		'incontent-leader-middle': {
			sizes: [[728, 90]],
			siteId: ['936390'],
		},
		'incontent-leader-inc': {
			sizes: [[728, 90]],
			siteId: ['936391'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936392', '936393'],
		},
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936394', '936395'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936396', '936397'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			siteId: ['936398'],
		},
		'incontent-leaderboard-middle': {
			sizes: [[728, 90]],
			siteId: ['936399'],
		},
		'incontent-leaderboard-inc': {
			sizes: [[728, 90]],
			siteId: ['936400'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			siteId: ['936401'],
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: ['936402', '936403'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			siteId: ['936404'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			siteId: ['936405'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			siteId: ['936406'],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-sticky': {
			sizes: [[320, 50]],
			siteId: ['936407'],
		},
		'mobile-omni-plus-sticky': {
			sizes: [[320, 50]],
			siteId: ['936408'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: ['936409'],
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			siteId: ['936410'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936411', '936412'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936413', '936414'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936415', '936416'],
		},
		'mobile-incontent-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936417', '936418'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			siteId: ['936419'],
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			siteId: ['936420'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936421', '936422'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			siteId: ['936423'],
		},
		'mobile-incontent-mpu-plus-inc': {
			sizes: [[300, 250]],
			siteId: ['936424'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			siteId: ['936425'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
