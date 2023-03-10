export function getPubmaticContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			ids: ['4857013'],
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			ids: ['4857014'],
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			ids: ['4857015'],
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			ids: ['4857016'],
		},
		'incontent-ad-plus-top': {
			sizes: [[728, 90]],
			ids: ['4857017'],
		},
		'incontent-ad-plus-middle': {
			sizes: [[728, 90]],
			ids: ['4857018'],
		},
		'incontent-ad-plus-bottom': {
			sizes: [[728, 90]],
			ids: ['4857019'],
		},
		'leader-top': {
			sizes: [[728, 90]],
			ids: ['4857020'],
		},
		'leader-inc': {
			sizes: [[728, 90]],
			ids: ['4857021'],
		},
		'leader-middle': {
			sizes: [[728, 90]],
			ids: ['4857022'],
		},
		'leader-middle2': {
			sizes: [[728, 90]],
			ids: ['4857023'],
		},
		'leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4857024', '4857025'],
		},
		'leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4857026', '4857027'],
		},
		'leaderboard-top': {
			sizes: [[728, 90]],
			ids: ['4857028'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			ids: ['4857029'],
		},
		'leaderboard-middle2': {
			sizes: [[728, 90]],
			ids: ['4857030'],
		},
		'leaderboard-inc': {
			sizes: [[728, 90]],
			ids: ['4857031'],
		},
		'leaderboard-bottom': {
			sizes: [[728, 90]],
			ids: ['4857032'],
		},
		'incontent-leader-middle': {
			sizes: [[728, 90]],
			ids: ['4857033'],
		},
		'incontent-leader-inc': {
			sizes: [[728, 90]],
			ids: ['4857034'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4857035', '4857036'],
		},
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4857037', '4857038'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4857039', '4857040'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			ids: ['4857041'],
		},
		'incontent-leaderboard-middle': {
			sizes: [[728, 90]],
			ids: ['4857042'],
		},
		'incontent-leaderboard-inc': {
			sizes: [[728, 90]],
			ids: ['4857043'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			ids: ['4857044'],
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			ids: ['4857045', '4857046'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			ids: ['4857047'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			ids: ['4857048'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			ids: ['4857049'],
		},
		video: {
			siteId: '4923780',
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-sticky': {
			sizes: [[320, 50]],
			ids: ['4857050'],
		},
		'mobile-omni-plus-sticky': {
			sizes: [[320, 50]],
			ids: ['4857051'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			ids: ['4857052'],
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			ids: ['4857053'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4857054', '4857055'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4857056', '4857057'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4857058', '4857059'],
		},
		'mobile-incontent-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4857060', '4857061'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			ids: ['4857062'],
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			ids: ['4857063'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4857064', '4857065'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			ids: ['4857066'],
		},
		'mobile-incontent-mpu-plus-inc': {
			sizes: [[300, 250]],
			ids: ['4857067'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			ids: ['4857068'],
		},
		video: {
			siteId: '4923781',
		},
	};

	return {
		enabled: false,
		publisherId: '156260',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
