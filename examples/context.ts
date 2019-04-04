import { slotService, utils } from '@wikia/ad-engine';

const disabledSlots = utils.queryString.get('disabled-slots');
const cid = utils.queryString.get('cid');

if (disabledSlots) {
	disabledSlots.split(',').forEach((slotName) => slotService.disable(slotName));
}

export default {
	src: 'test',
	adUnitId:
		'/5441/wka.life/_project43//{custom.namespace}/{slotConfig.targeting.src}/{slotConfig.slotName}',
	bidders: {
		timeout: 2000,
		a9: {
			dealsEnabled: false,
			enabled: true,
			videoEnabled: false,
			amazonId: '3115',
			slots: {
				top_leaderboard: {
					sizes: [[728, 90]],
					slotId: 'TOP_LEADERBOARD',
				},
				TOP_BOXAD: {
					sizes: [[300, 250]],
					slotId: 'TOP_BOXAD',
				},
				featured: {
					type: 'video',
					slotId: 'FEATURED',
				},
				incontent_boxad: {
					slotId: 'MOBILE_IN_CONTENT',
					sizes: [[300, 250]],
				},
			},
		},
		prebid: {
			enabled: true,
			libraryUrl: '../../vendor/dist/prebid.min.js',
			lazyLoadingEnabled: false,
			bidsRefreshing: {
				enabled: true,
				slots: ['incontent_boxad'],
			},
			vmg: {
				enabled: true,
				slots: {
					top_leaderboard: {
						sizes: [[3, 3]],
					},
				},
			},
			wikia: {
				enabled: true,
				slots: {
					top_leaderboard: {
						sizes: [[728, 90]],
					},
					TOP_BOXAD: {
						sizes: [[300, 250]],
					},
					incontent_boxad: {
						sizes: [[300, 250]],
					},
					bottom_leaderboard: {
						sizes: [[728, 90]],
					},
				},
			},
			wikiaVideo: {
				enabled: true,
				slots: {
					incontent_player: {
						videoAdUnitId: '/5441/wka.life/_project43//article/test/outstream',
						customParams:
							's1=_project43&artid=402&src=test&pos=incontent_player&passback=wikiaVideo',
					},
					featured: {
						videoAdUnitId: '/5441/wka.life/_project43//article/test/featured',
						customParams: 's1=_project43&artid=402&src=test&pos=featured&passback=wikiaVideo',
					},
				},
			},
		},
	},
	custom: {
		namespace: 'article',
	},
	events: {
		pushOnScroll: {
			ids: ['incontent_boxad', 'bottom_leaderboard'],
			threshold: 100,
		},
		pushAfterRendered: {
			repeatable_boxad_1: ['incontent_player'],
		},
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		maxDelayTimeout: 2000,
		porvata: {
			audio: {
				exposeToSlot: true,
				segment: '-audio',
				key: 'audio',
			},
		},
		featuredVideo15sEnabled: false,
		video: {
			adsOnNextVideoFrequency: 3,
			isMidrollEnabled: false,
			isPostrollEnabled: false,
			playAdsOnNextVideo: true,
			moatTracking: {
				enabled: true,
				enabledForArticleVideos: true,
				jwplayerPluginUrl: 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js',
				partnerCode: 'wikiaimajsint377461931603',
				sampling: 1,
			},
		},
		slotRepeater: true,
		trackingOptIn: false,
	},
	listeners: {
		twitch: [
			{
				onEvent(eventName, params, data) {
					console.log('🗣 Twitch listener: onEvent', eventName, data);
				},
			},
		],
		porvata: [
			{
				onEvent(eventName, params, data) {
					console.log('🗣 Custom listener: onEvent', eventName, data);
				},
			},
		],
		slot: [
			{
				onRenderEnded(adSlot) {
					console.log(`💸 Custom listener: onRenderEnded ${adSlot.getSlotName()}`);
				},
				onImpressionViewable(adSlot) {
					console.log(`👁 Custom listener: onImpressionViewable ${adSlot.getSlotName()}`);
				},
				onCustomEvent(adSlot, data) {
					console.log(`👁 Custom listener: onCustomEvent ${adSlot.getSlotName()} ${data.status}`);
				},
			},
		],
	},
	networkId: '5441',
	slots: {
		top_leaderboard: {
			aboveTheFold: true,
			firstCall: true,
			sizes: [
				{
					viewportSize: [728, 0],
					sizes: [[728, 90], [3, 3]],
				},
			],
			defaultClasses: ['i-am-the-default-class-added-on-create'],
			defaultSizes: [[300, 250], [2, 2]],
			targeting: {
				loc: 'top',
			},
		},
		top_boxad: {
			aboveTheFold: true,
			bidderAlias: 'TOP_BOXAD',
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[300, 250], [300, 600]],
				},
			],
			defaultSizes: [[300, 250]],
			targeting: {
				loc() {
					return window.innerWidth < 800 ? 'middle' : 'top';
				},
			},
		},
		incontent_boxad: {
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[300, 250], [300, 600]],
				},
			],
			defaultSizes: [[300, 250]],
			defaultTemplates: ['floating-ad'],
			targeting: {
				loc: 'hivi',
			},
		},
		incontent_player: {
			avoidConflictWith: '.repeatable-boxad',
			defaultSizes: [[1, 1]],
			insertBeforeSelector: '.main p',
			targeting: {
				loc: 'hivi',
			},
		},
		injected_boxad: {
			avoidConflictWith: null,
			defaultSizes: [[300, 250]],
			insertBeforeSelector: '.main h2',
			insertBelowFirstViewport: true,
			targeting: {
				loc: 'hivi',
			},
		},
		invisible_skin: {
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[1000, 1000]],
				},
			],
			defaultSizes: [[1000, 1000]],
		},
		invisible_high_impact_2: {
			outOfPage: true,
			targeting: {
				loc: 'hivi',
			},
		},
		repeatable_boxad_1: {
			bidderAlias: 'incontent_boxad',
			defaultSizes: [[300, 250]],
			avoidConflictWith: '.repeatable-boxad,#incontent_player',
			insertBeforeSelector: '.main p',
			repeat: {
				additionalClasses: 'hide',
				index: 1,
				limit: null,
				slotNamePattern: 'repeatable_boxad_{slotConfig.repeat.index}',
				updateProperties: {
					'targeting.rv': '{slotConfig.repeat.index}',
				},
			},
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[300, 250], [300, 600]],
				},
			],
			targeting: {
				loc: 'hivi',
				pos: 'repeatable_boxad',
				rv: 1,
			},
		},
		bottom_leaderboard: {
			disabled: true,
			sizes: [
				{
					viewportSize: [728, 0],
					sizes: [[728, 90], [3, 3]],
				},
			],
			defaultSizes: [[300, 250], [2, 2]],
			targeting: {
				loc: 'footer',
				pos: ['bottom_leaderboard', 'mobile_prefooter'],
			},
			viewportConflicts: ['top_boxad'],
		},
		outstream: {
			lowerSlotName: 'outstream',
			group: 'VIDEO',
			targeting: {},
			videoAdUnit:
				'/{networkId}/wka1a.{slotConfig.group}/{slotConfig.lowerSlotName}' +
				'{slotConfig.audioSegment}/{custom.device}/ae-{custom.adLayout}/_example',
		},
		featured: {
			lowerSlotName: 'featured',
			group: 'VIDEO',
			targeting: {
				wsi: 'xxx1',
			},
			trackingKey: 'featured-video',
			videoAdUnit:
				'/{networkId}/wka1a.{slotConfig.group}/{slotConfig.lowerSlotName}' +
				'/{custom.device}/ae-{custom.adLayout}/_example',
		},
		incontent_native: {
			aboveTheFold: true,
			firstCall: true,
			lowerSlotName: 'incontent_native',
			group: 'NATIVE',
			sizes: [],
			defaultSizes: ['fluid'],
			targeting: {
				loc: 'top',
			},
		},
	},
	services: {
		billTheLizard: {
			enabled: true,
			host: 'https://services.wikia-dev.pl',
			endpoint: 'bill-the-lizard/predict',
			projects: {
				queen_of_hearts: [
					{
						name: 'ctp_desktop:1.0.0',
						countries: ['XX/50'],
						on_0: ['logResult'],
						on_1: ['logResult'],
					},
					{
						name: 'queen_of_hearts:0.0.1',
						countries: ['XX'],
						dfp_targeting: true,
						on_1: ['logResult'],
					},
					{
						name: 'queen_of_hearts',
						countries: ['XX'],
						dfp_targeting: true,
						on_1: ['logResult'],
					},
				],
				cheshirecat: [
					{
						name: 'cheshirecat:0.0.1',
						dfp_targeting: true,
						countries: ['XX'],
						on_0: ['logResult'],
						on_1: ['catlapse', 'logResult'],
					},
				],
			},
			parameters: {
				queen_of_hearts: {
					device: 'tablet',
					v1: 'Fgas3ooM',
					geo: 'PL',
					wiki_id: 245424,
					vtags: 'Twin Peaks',
					esrb: 'mature',
					s0v: 'tv',
					ref: 'direct',
					top_1k: 0,
					s2: 'article',
				},
				cheshirecat: {
					bids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1].join(','),
				},
			},
			timeout: 2000,
		},
		krux: {
			enabled: true,
			id: 'KPSUiAKl',
		},
		moatYi: {
			enabled: true,
			partnerCode: 'wikiaprebidheader490634422386',
		},
	},
	state: {
		adStack: window.adsQueue,
		isMobile: false,
		provider: 'gpt',
	},
	targeting: {
		ae3: '1',
		cid: cid || null,
		outstream: 'none',
		s1: '_project43',
		uap: 'none',
	},
	vast: {
		size: [640, 480],
		adUnitId:
			'/{networkId}/wka.life/_project43//{custom.namespace}/' +
			'{slotConfig.targeting.src}/{slotConfig.slotName}',
	},
	templates: {},
};
