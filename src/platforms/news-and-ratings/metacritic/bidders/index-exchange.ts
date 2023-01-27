export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936309', '936310'],
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: ['936311'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: ['936312', '936313'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: ['936314'],
		},
		leader_bottom: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936315', '936316'],
		},
		leader_middle: {
			sizes: [[728, 90]],
			siteId: ['936317'],
		},
		leader_middle2: {
			sizes: [[728, 90]],
			siteId: ['936318'],
		},
		incontent_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936319', '936320'],
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936321', '936322'],
		},
		mobile_incontent_plus_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936323', '936324'],
		},
		mobile_banner_plus_middle: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936325', '936326'],
		},
		mobile_incontent_plus_middle2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936327', '936328'],
		},
		mobile_mpu_banner_bottom: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936329', '936330'],
		},
		mobile_gallery_banner_plus_1: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936331', '936332'],
		},
		mobile_gallery_banner_plus_2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936333', '936334'],
		},
		mobile_gallery_banner_plus_3: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936335', '936336'],
		},
		mobile_gallery_banner_plus_4: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936337', '936338'],
		},
		mobile_gallery_banner_plus_5: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936339', '936340'],
		},
		mobile_gallery_banner_plus_6: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936341', '936342'],
		},
		mobile_gallery_banner_plus_7: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936343', '936344'],
		},
		mobile_gallery_banner_plus_8: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936345', '936346'],
		},
		mobile_gallery_banner_plus_9: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936347', '936348'],
		},
		mobile_gallery_banner_plus_10: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936349', '936350'],
		},
		mobile_gallery_banner_plus_11: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936351', '936352'],
		},
		mobile_gallery_banner_plus_12: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936353', '936354'],
		},
		mobile_gallery_banner_plus_13: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936355', '936356'],
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			siteId: ['936357'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
