export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['735481387', '142384784'],
			cid: '8CU5JOKX4',
		},
		leader_top: {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			crid: ['433823587', '497804456'],
			cid: '8CU5JOKX4',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			crid: ['433823587'],
			cid: '8CU5JOKX4',
		},
		leader_bottom: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['735481387', '142384784'],
			cid: '8CU5JOKX4',
		},
		leader_middle: {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		leader_middle2: {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		incontent_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['735481387', '142384784'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_incontent_plus_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_banner_plus_middle: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_incontent_plus_middle2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_mpu_banner_bottom: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_1: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_3: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_4: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_5: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_6: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_7: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_8: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_9: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_10: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_11: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_12: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		mobile_gallery_banner_plus_13: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['134715738', '278522313'],
			cid: '8CU5JOKX4',
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			crid: ['278522313'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
