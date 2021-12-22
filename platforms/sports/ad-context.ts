import futheadFallbackInstantConfig from './fallback-config-futhead.json';
import mutheadFallbackInstantConfig from './fallback-config-muthead.json';

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
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: ['sports'],
	state: {
		adStack: [],
		isMobile: false,
	},
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
			enabled: false,
			libraryUrl: '//tag.durationmedia.net/sites/10654/dm.js',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['cdm-zone-01', 'cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=futhead',
			fallback: futheadFallbackInstantConfig,
		},
	},
};

const mutheadContext = {
	application: 'muthead',
	services: {
		durationMedia: {
			enabled: false,
			libraryUrl: '//tag.durationmedia.net/sites/10655/dm.js',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['cdm-zone-01', 'cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=muthead',
			fallback: mutheadFallbackInstantConfig,
		},
	},
};

export function getBasicContext(app): object {
	if (app === 'futhead') {
		Object.assign(basicContext, futheadContext);
	}

	if (app === 'muthead') {
		Object.assign(basicContext, mutheadContext);
	}

	return basicContext;
}
