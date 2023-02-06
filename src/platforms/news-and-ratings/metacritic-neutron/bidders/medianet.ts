export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-nav': {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		'omni-skybox-leaderboard-nav': {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-plus-top': {
			sizes: [
				[970, 250],
				[728, 90],
			],
			crid: ['142384784', '735481387'],
			cid: '8CU5JOKX4',
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['735481387', '142384784'],
			cid: '8CU5JOKX4',
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		'mpu-plus-top': {
			sizes: [[300, 250]],
			crid: ['433823587'],
			cid: '8CU5JOKX4',
		},
		'mpu-top': {
			sizes: [[300, 250]],
			crid: ['433823587'],
			cid: '8CU5JOKX4',
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			crid: ['134715738'],
			cid: '8CU5JOKX4',
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			crid: ['134715738'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-nav': {
			sizes: [[320, 50]],
			crid: ['278522313'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-plus': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			crid: ['278522313', '433823587'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['433823587', '278522313'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[320, 50],
				[300, 250],
			],
			crid: ['278522313', '134715738'],
			cid: '8CU5JOKX4',
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
