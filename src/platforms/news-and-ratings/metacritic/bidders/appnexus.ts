export function getAppnexusContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574573', '28574574'],
		},
		leader_top: {
			sizes: [[728, 90]],
			placementId: ['28574575'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			placementId: ['28574576', '28574577'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			placementId: ['28574578'],
		},
		leader_bottom: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574579', '28574580'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			placementId: ['28574581'],
		},
		leader_middle2: {
			sizes: [[728, 90]],
			placementId: ['28574582'],
		},
		incontent_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			placementId: ['28574583', '28574584'],
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574585', '28574586'],
		},
		mobile_incontent_plus_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574587', '28574588'],
		},
		mobile_banner_plus_middle: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574589', '28574590'],
		},
		mobile_incontent_plus_middle2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574591', '28574592'],
		},
		mobile_mpu_banner_bottom: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574593', '28574594'],
		},
		mobile_gallery_banner_plus_1: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574595', '28574596'],
		},
		mobile_gallery_banner_plus_2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574597', '28574598'],
		},
		mobile_gallery_banner_plus_3: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574599', '28574600'],
		},
		mobile_gallery_banner_plus_4: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574601', '28574602'],
		},
		mobile_gallery_banner_plus_5: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574603', '28574604'],
		},
		mobile_gallery_banner_plus_6: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574605', '28574606'],
		},
		mobile_gallery_banner_plus_7: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574607', '28574608'],
		},
		mobile_gallery_banner_plus_8: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574609', '28574610'],
		},
		mobile_gallery_banner_plus_9: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574611', '28574612'],
		},
		mobile_gallery_banner_plus_10: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574613', '28574614'],
		},
		mobile_gallery_banner_plus_11: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574615', '28574616'],
		},
		mobile_gallery_banner_plus_12: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574617', '28574618'],
		},
		mobile_gallery_banner_plus_13: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			placementId: ['28574619', '28574620'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			placementId: ['28574621'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
