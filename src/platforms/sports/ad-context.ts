import { selectApplication } from './utils/application-helper';

const basicContext = {
	adUnitId:
		'/{custom.dfpId}/cports/{slotConfig.group}/{state.deviceType}/' +
		'{targeting.skin}-{targeting.s2}/_{targeting.s1}-{targeting.s0}',
	custom: {
		dfpId: '5441',
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
		},
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		maxDelayTimeout: 2000,
		wad: {
			enabled: false,
			blocking: false,
			btRec: {
				enabled: false,
			},
		},
	},
	slots: {},
	slotGroups: {
		VIDEO: ['FEATURED', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: ['sports'],
	templates: {},
	vast: {
		adUnitId:
			'/{custom.dfpId}/cports/{slotConfig.adProduct}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/_{targeting.s1}-{targeting.s0}',
	},
};

const futheadContext = {
	application: 'futhead',
	services: {
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/10654/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['cdm-zone-01', 'cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com',
			appName: 'futhead',
			fallback:
				'https://script.wikia.nocookie.net/fandom-ae-assets/icbm/prod/icbm_state_futhead.json',
		},
	},
};

const mutheadContext = {
	application: 'muthead',
	services: {
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/10655/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['cdm-zone-01', 'cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com',
			appName: 'muthead',
			fallback:
				'https://script.wikia.nocookie.net/fandom-ae-assets/icbm/prod/icbm_state_muthead.json',
		},
	},
};

export function getBasicContext(): object {
	Object.assign(basicContext, selectApplication(futheadContext, mutheadContext));

	return basicContext;
}
