export function getPubmaticContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			ids: ['4856964'],
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			ids: ['4856966'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
			ids: ['4856971', '4856974'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			ids: ['4856974'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856970', '4856965'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			ids: ['4856972'],
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			ids: ['4856967'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			ids: ['4856969'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			ids: ['4856980'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			ids: ['4856982'],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
			ids: ['4856977'],
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			ids: ['4856979', '4856967'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856969', '4856981'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			ids: ['4856983', '4856980'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			ids: ['4856973'],
		},
	};

	return {
		enabled: false,
		publisherId: '156260',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
