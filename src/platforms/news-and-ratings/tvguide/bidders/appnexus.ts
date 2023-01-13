export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			placementId: ['28574634'],
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			placementId: ['28574635'],
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			placementId: ['28574636'],
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			placementId: ['28574637'],
		},
		'incontent-ad-plus-top': {
			sizes: [[728, 90]],
			placementId: ['28574638'],
		},
		'incontent-ad-plus-middle': {
			sizes: [[728, 90]],
			placementId: ['28574639'],
		},
		'incontent-ad-plus-bottom': {
			sizes: [[728, 90]],
			placementId: ['28574640'],
		},
		'leader-top': {
			sizes: [[728, 90]],
			placementId: ['28574641'],
		},
		'leader-inc': {
			sizes: [[728, 90]],
			placementId: ['28574642'],
		},
		'leader-middle': {
			sizes: [[728, 90]],
			placementId: ['28574643'],
		},
		'leader-middle2': {
			sizes: [[728, 90]],
			placementId: ['28574644'],
		},
		'leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574645', '28574646'],
		},
		'leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574647', '28574648'],
		},
		'leaderboard-top': {
			sizes: [[728, 90]],
			placementId: ['28574649'],
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			placementId: ['28574650'],
		},
		'leaderboard-middle2': {
			sizes: [[728, 90]],
			placementId: ['28574651'],
		},
		'leaderboard-inc': {
			sizes: [[728, 90]],
			placementId: ['28574652'],
		},
		'leaderboard-bottom': {
			sizes: [[728, 90]],
			placementId: ['28574653'],
		},
		'incontent-leader-middle': {
			sizes: [[728, 90]],
			placementId: ['28574654'],
		},
		'incontent-leader-inc': {
			sizes: [[728, 90]],
			placementId: ['28574655'],
		},
		'incontent-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574656', '28574657'],
		},
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574658', '28574659'],
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574660', '28574661'],
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			placementId: ['28574662'],
		},
		'incontent-leaderboard-middle': {
			sizes: [[728, 90]],
			placementId: ['28574663'],
		},
		'incontent-leaderboard-inc': {
			sizes: [[728, 90]],
			placementId: ['28574664'],
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			placementId: ['28574665'],
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementId: ['28574666', '28574667'],
		},
		'mpu-top': {
			sizes: [[300, 250]],
			placementId: ['28574668'],
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			placementId: ['28574669'],
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			placementId: ['28574670'],
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-sticky': {
			sizes: [[320, 50]],
			placementId: ['28574671'],
		},
		'mobile-omni-plus-sticky': {
			sizes: [[320, 50]],
			placementId: ['28574672'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: ['28574673'],
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			placementId: ['28574674'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574675', '28574676'],
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574677', '28574678'],
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574679', '28574680'],
		},
		'mobile-incontent-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574681', '28574682'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			placementId: ['28574683'],
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			placementId: ['28574684'],
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574685', '28574686'],
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			placementId: ['28574687'],
		},
		'mobile-incontent-mpu-plus-inc': {
			sizes: [[300, 250]],
			placementId: ['28574688'],
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			placementId: ['28574689'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
