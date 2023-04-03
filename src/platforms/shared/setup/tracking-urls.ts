import { Dictionary } from '@wikia/ad-engine';

interface TrackingConfig {
	threshold: boolean;
	aggregation: boolean;
}

interface TrackingUrl {
	name: string;
	url: string;
	config: TrackingConfig;
}

export const trackingUrls: Dictionary<TrackingUrl> = {
	AD_ENG_LOAD_TIMES: {
		name: 'AdEngLoadTimes',
		url: 'https://beacon.wikia-services.com/__track/special/adengloadtimes',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	AD_ENG_BIDDERS: {
		name: 'AdEngBidders',
		url: 'https://beacon.wikia-services.com/__track/special/adengbidders',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	AD_ENG_VIEWABILITY: {
		name: 'AdEngViewability',
		url: 'https://beacon.wikia-services.com/__track/special/adengviewability',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	AD_ENG_PLAYER_INFO: {
		name: 'AdEngPlayerInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengplayerinfo',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	KEY_VALS: {
		name: 'KeyVals',
		url: 'https://beacon.wikia-services.com/__track/special/keyvals',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	AD_ENG_AD_SIZE_INFO: {
		name: 'AdEngAdSizeInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengadsizeinfo',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	AD_ENG_LABRADOR_INFO: {
		name: 'AdEngLabradorInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adenglabradorinfo',
		config: {
			threshold: true,
			aggregation: true,
		},
	},
	AD_ENG_AD_INFO: {
		name: 'AdEngAdInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengadinfo',
		config: {
			threshold: false,
			aggregation: true,
		},
	},
	IDENTITY_INFO: {
		name: 'IdentityInfo',
		url: 'https://beacon.wikia-services.com/__track/special/identityinfo',
		config: {
			threshold: false,
			aggregation: true,
		},
	},
	TRACKING_EVENT: {
		name: 'TrackingEvent',
		url: 'https://beacon.wikia-services.com/__track/special/trackingevent',
		config: {
			threshold: false,
			aggregation: true,
		},
	},
	VIDEO_PLAYER_EVENT: {
		name: 'VideoPlayerEvent',
		url: 'https://beacon.wikia-services.com/__track/special/videoplayerevent',
		config: {
			threshold: false,
			aggregation: true,
		},
	},
};
