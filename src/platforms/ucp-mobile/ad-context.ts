export const basicContext = {
	adUnitId:
		'/{custom.dfpId}' +
		'/{custom.serverPrefix}.{slotConfig.group}' +
		'/{slotConfig.adProduct}{slotConfig.slotNameSuffix}' +
		'/{state.deviceType}' +
		'/{targeting.skin}-{targeting.original_host}-{targeting.s2}' +
		'/{custom.wikiIdentifier}-{targeting.s0}',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			videoEnabled: false,
			amazonId: '3115',
			bidsRefreshing: {
				slots: ['featured', 'gallery_leaderboard', 'mobile_in_content'],
			},
		},
		prebid: {
			enabled: false,
			bidsRefreshing: {
				slots: ['gallery_leaderboard', 'mobile_in_content'],
			},
		},
	},
	custom: {
		dbNameForAdUnit: '_not_a_top1k_wiki',
		dfpId: '5441',
		serverPrefix: 'wka1b',
		wikiIdentifier: '_not_a_top1k_wiki',
	},
	events: {
		pushOnScroll: {
			ids: [],
		},
	},
	slots: {},
	vast: {
		adUnitId:
			'/{custom.dfpId}' +
			'/{custom.serverPrefix}.{slotConfig.group}' +
			'/{slotConfig.adProduct}{slotConfig.slotNameSuffix}' +
			'/{state.deviceType}' +
			'/{targeting.skin}-{targeting.original_host}-{targeting.s2}' +
			'/{custom.wikiIdentifier}-{targeting.s0}',
		adUnitIdWithDbName:
			'/{custom.dfpId}' +
			'/{custom.serverPrefix}.{slotConfig.group}' +
			'/{slotConfig.adProduct}{slotConfig.slotNameSuffix}' +
			'/{state.deviceType}' +
			'/{targeting.skin}-{targeting.original_host}-{targeting.s2}' +
			'/{custom.dbNameForAdUnit}-{targeting.s0}',
	},
	templates: {
		incontentAnchorSelector:
			'.mw-parser-output > h2,.mw-parser-output > section > h3,.mw-parser-output > section > h4,.mw-parser-output > section > h5,.mw-parser-output > h3,.mw-parser-output > h4,.mw-parser-output > h5',
	},
	services: {
		anyclip: {
			pubname: 'fandomcom',
			widgetname: {
				anime: '001w000001Y8ud2AAB_M8449',
				games: '001w000001Y8ud2AAB_M8448',
				default: '001w000001Y8ud2AAB_M6237',
			},
			libraryUrl: 'https://player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js',
			latePageInject: true,
		},
		connatix: {
			enabled: false,
			cid: '016551d5-7095-47c0-a46b-fd0cb9bf4c72',
			playerId: '039a9ead-fb3b-4afc-bcfb-ed241bbaa8d1',
			renderId: '858c22ce64e241d5acc77c4f6ed56d2d',
		},
		doubleVerify: {
			slots: [
				'top_leaderboard',
				'top_boxad',
				'incontent_boxad_1',
				'bottom_leaderboard',
				'featured',
				'incontent_player',
			],
		},
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/10651/dm.js',
		},
		externalLogger: {
			endpoint: '/wikia.php?controller=AdEngine&method=postLog',
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com',
			appName: 'fandommobile',
			fallback:
				'https://script.wikia.nocookie.net/fandom-ae-assets/icbm/prod/icbm_state_fandommobile.json',
		},
		iasPublisherOptimization: {
			slots: [
				'top_leaderboard',
				'top_boxad',
				'incontent_boxad_1',
				'bottom_leaderboard',
				'featured',
				'incontent_player',
			],
		},
		openWeb: {
			placementSelector: 'div[class*="openweb-slot"]',
		},
	},
	slotGroups: {
		VIDEO: ['FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: ['mobile'],
	state: {
		adStack: [],
		isMobile: true,
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		video: {
			iasTracking: {
				enabled: false,
				config: {
					anId: '930616',
					campId: '640x480',
				},
			},
		},
	},
};
