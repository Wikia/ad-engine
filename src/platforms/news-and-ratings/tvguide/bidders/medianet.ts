export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-plus-top': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-plus-middle': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-ad-plus-bottom': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leader-top': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leader-inc': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leader-middle': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leader-middle2': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['244869244', '515441157'],
			cid: '8CU5JOKX4',
		},
		'leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['244869244', '515441157'],
			cid: '8CU5JOKX4',
		},
		'leaderboard-top': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leaderboard-middle2': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leaderboard-inc': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'leaderboard-bottom': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-middle': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-inc': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['244869244', '515441157'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['244869244', '515441157'],
			cid: '8CU5JOKX4',
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['244869244', '515441157'],
			cid: '8CU5JOKX4',
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-leaderboard-middle': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-leaderboard-inc': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			crid: ['244869244'],
			cid: '8CU5JOKX4',
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			crid: ['389700318', '467334965'],
			cid: '8CU5JOKX4',
		},
		'mpu-top': {
			sizes: [[300, 250]],
			crid: ['389700318'],
			cid: '8CU5JOKX4',
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			crid: ['389700318'],
			cid: '8CU5JOKX4',
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			crid: ['389700318'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-sticky': {
			sizes: [[320, 50]],
			crid: ['760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-omni-plus-sticky': {
			sizes: [[320, 50]],
			crid: ['760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			crid: ['268164352'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			crid: ['268164352'],
			cid: '8CU5JOKX4',
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['268164352', '760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['268164352', '760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['268164352', '760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['268164352', '760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			crid: ['760349862'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			crid: ['268164352'],
			cid: '8CU5JOKX4',
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['668627426', '141863528'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			crid: ['268164352'],
			cid: '8CU5JOKX4',
		},
		'mobile-incontent-mpu-plus-inc': {
			sizes: [[300, 250]],
			crid: ['268164352'],
			cid: '8CU5JOKX4',
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			crid: ['668627426'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
