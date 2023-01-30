export function getKargoContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: '_uAtUAaayo0',
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: '_uAtUAaayo0',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementIds: ['_pC1SeRWmK7', '_eOUEsgvd6R'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: '_pC1SeRWmK7',
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_incontent_plus_top: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_banner_plus_middle: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_incontent_plus_middle2: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_mpu_banner_bottom: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_gallery_banner_plus_1: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_gallery_banner_plus_2: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_gallery_banner_plus_3: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_gallery_banner_plus_4: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_gallery_banner_plus_5: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		mobile_gallery_banner_plus_6: {
			sizes: [[300, 250]],
			placementId: '_wsvT3CcnTu',
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			placementId: '_qCPEPdoeme',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
