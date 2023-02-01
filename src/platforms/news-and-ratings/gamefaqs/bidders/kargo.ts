export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			placementId: '_r4Gu3JPVTP',
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: '_r4Gu3JPVTP',
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: '_r4Gu3JPVTP',
		},
		mpu_top: {
			sizes: [[300, 250]],
			placementId: '_fgZaPpiKvX',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementId: '_l7isSJtCQz',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: '_fgZaPpiKvX',
		},
	};

	const mobileSlots = {
		'mobile-native-top': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
		'mobile-incontent-ad': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
		'mobile-native-plus-top': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
		'incontent-mobile-flex': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			placementId: '_r4Gu3JPVTP',
		},
		'mobile-banner-plus-inc': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
		'mobile-incontent-ad-plus': {
			sizes: [[300, 250]],
			placementId: '_tMVy7XFXcU',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
