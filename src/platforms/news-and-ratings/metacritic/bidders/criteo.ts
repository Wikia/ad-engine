export function getCriteoContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		leader_top: {
			sizes: [[728, 90]],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
		},
		leader_bottom: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		leader_middle: {
			sizes: [[728, 90]],
		},
		leader_middle2: {
			sizes: [[728, 90]],
		},
		incontent_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_incontent_plus_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_banner_plus_middle: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_incontent_plus_middle2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_mpu_banner_bottom: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_1: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_3: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_4: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_5: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_6: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_7: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_8: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_9: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_10: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_11: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_12: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		mobile_gallery_banner_plus_13: {
			sizes: [
				[300, 250],
				[320, 50],
			],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
		},
	};

	return {
		enabled: false,
		networkId: 3306,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
