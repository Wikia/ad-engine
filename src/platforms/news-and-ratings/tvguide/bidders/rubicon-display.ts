export function getRubiconDisplayContext(isDesktop: boolean): object {
	const desktopSlots = {
		'omni-skybox-leader-sticky': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720128',
		},
		'omni-skybox-leaderboard-sticky': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720130',
		},
		'omni-leader-sticky': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720132',
		},
		'omni-leaderboard-sticky': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720134',
		},
		'incontent-ad-plus-top': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720136',
		},
		'incontent-ad-plus-middle': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720138',
		},
		'incontent-ad-plus-bottom': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720140',
		},
		'leader-top': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720142',
		},
		'leader-inc': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720144',
		},
		'leader-middle': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720146',
		},
		'leader-middle2': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720148',
		},
		'leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462852',
			zoneId: '2720150',
		},
		'leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462852',
			zoneId: '2720152',
		},
		'leaderboard-top': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720154',
		},
		'leaderboard-middle': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720156',
		},
		'leaderboard-middle2': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720158',
		},
		'leaderboard-inc': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720160',
		},
		'leaderboard-bottom': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720162',
		},
		'incontent-leader-middle': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720164',
		},
		'incontent-leader-inc': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720166',
		},
		'incontent-leader-plus-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462852',
			zoneId: '2720168',
		},
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462852',
			zoneId: '2720170',
		},
		'incontent-leader-plus-bottom': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462852',
			zoneId: '2720172',
		},
		'incontent-leaderboard-top': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720174',
		},
		'incontent-leaderboard-middle': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720176',
		},
		'incontent-leaderboard-inc': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720178',
		},
		'incontent-leaderboard-bottom': {
			sizes: [[728, 90]],
			siteId: '462852',
			zoneId: '2720180',
		},
		'mpu-plus-top': {
			sizes: [
				[300, 250],
				[300, 600],
			],
			siteId: '462852',
			zoneId: '2720182',
		},
		'mpu-top': {
			sizes: [[300, 250]],
			siteId: '462852',
			zoneId: '2720184',
		},
		'mpu-middle': {
			sizes: [[300, 250]],
			siteId: '462852',
			zoneId: '2720186',
		},
		'mpu-bottom': {
			sizes: [[300, 250]],
			siteId: '462852',
			zoneId: '2720188',
		},
		video: {
			siteId: '462852',
		},
	};

	const mobileSlots = {
		'mobile-omni-skybox-plus-sticky': {
			sizes: [[320, 50]],
			siteId: '462854',
			zoneId: '2720190',
		},
		'mobile-omni-plus-sticky': {
			sizes: [[320, 50]],
			siteId: '462854',
			zoneId: '2720192',
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			siteId: '462854',
			zoneId: '2720194',
		},
		'mobile-banner-plus': {
			sizes: [[300, 250]],
			siteId: '462854',
			zoneId: '2720196',
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462854',
			zoneId: '2720198',
		},
		'mobile-incontent-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462854',
			zoneId: '2720200',
		},
		'mobile-incontent-plus-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462854',
			zoneId: '2720202',
		},
		'mobile-incontent-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: '462854',
			zoneId: '2720204',
		},
		'mobile-nav-ad-plus-banner': {
			sizes: [[320, 50]],
			siteId: '462854',
			zoneId: '2720206',
		},
		'mobile-incontent-mpu-plus': {
			sizes: [[300, 250]],
			siteId: '462854',
			zoneId: '2720208',
		},
		'incontent-all-top': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: '462854',
			zoneId: '2720210',
		},
		'mobile-incontent-all': {
			sizes: [[300, 250]],
			siteId: '462854',
			zoneId: '2720212',
		},
		'mobile-incontent-mpu-plus-inc': {
			sizes: [[300, 250]],
			siteId: '462854',
			zoneId: '2720214',
		},
		'incontent-narrow-all-top': {
			sizes: [[728, 90]],
			siteId: '462854',
			zoneId: '2720216',
		},
		video: {
			siteId: '462854',
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
