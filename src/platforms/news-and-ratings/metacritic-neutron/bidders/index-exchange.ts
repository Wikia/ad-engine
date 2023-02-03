export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			siteId: ['936309'],
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			siteId: ['936311'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936315', '936310'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			siteId: ['936317'],
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			siteId: ['936312'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			siteId: ['936314'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			siteId: ['936325'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			siteId: ['936327'],
		},
		video: {
			siteId: '936594',
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
			siteId: ['936322'],
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			siteId: ['936324', '936312'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936314', '936326'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			siteId: ['936328', '936325'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			siteId: ['936318'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
			siteId: ['936316', '936319'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			siteId: ['936319'],
		},
		video: {
			siteId: '936611',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
