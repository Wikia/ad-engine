export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462846',
			zoneId: '2720056',
		},
		leader_top: {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720058',
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: '462846',
			zoneId: '2720060',
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			siteId: '462846',
			zoneId: '2720062',
		},
		leader_bottom: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462846',
			zoneId: '2720064',
		},
		leader_middle: {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720066',
		},
		leader_middle2: {
			sizes: [[728, 90]],
			siteId: '462846',
			zoneId: '2720068',
		},
		incontent_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462846',
			zoneId: '2720070',
		},
		video: {
			siteId: '462846',
		},
	};

	const mobileSlots = {
		mobile_banner_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720074',
		},
		mobile_incontent_plus_top: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720076',
		},
		mobile_banner_plus_middle: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720078',
		},
		mobile_incontent_plus_middle2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720080',
		},
		mobile_mpu_banner_bottom: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720082',
		},
		mobile_gallery_banner_plus_1: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720084',
		},
		mobile_gallery_banner_plus_2: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720086',
		},
		mobile_gallery_banner_plus_3: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720088',
		},
		mobile_gallery_banner_plus_4: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720090',
		},
		mobile_gallery_banner_plus_5: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720092',
		},
		mobile_gallery_banner_plus_6: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720094',
		},
		mobile_gallery_banner_plus_7: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720096',
		},
		mobile_gallery_banner_plus_8: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720098',
		},
		mobile_gallery_banner_plus_9: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720100',
		},
		mobile_gallery_banner_plus_10: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720102',
		},
		mobile_gallery_banner_plus_11: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720104',
		},
		mobile_gallery_banner_plus_12: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720106',
		},
		mobile_gallery_banner_plus_13: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462848',
			zoneId: '2720108',
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			siteId: '462848',
			zoneId: '2720110',
		},
		video: {
			siteId: '462848',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
