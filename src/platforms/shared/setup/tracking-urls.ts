import { Dictionary } from '@wikia/ad-engine';

interface TrackingConfigOfAllowedOptions {
	sampling: boolean;
	aggregation: boolean;
}

export interface TrackingUrl {
	name: string;
	url: string;
	allowed: TrackingConfigOfAllowedOptions;
}

export const trackingUrls: Dictionary<TrackingUrl> = {
	AD_ENG_LOAD_TIMES: {
		name: 'AdEngLoadTimes',
		url: 'https://beacon.wikia-services.com/__track/special/adengloadtimes',
		allowed: {
			sampling: true,
			aggregation: true,
		},
	},
	AD_ENG_BIDDERS: {
		name: 'AdEngBidders',
		url: 'https://beacon.wikia-services.com/__track/special/adengbidders',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_VIEWABILITY: {
		name: 'AdEngViewability',
		url: 'https://beacon.wikia-services.com/__track/special/adengviewability',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_PLAYER_INFO: {
		name: 'AdEngPlayerInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengplayerinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	KEY_VALS: {
		name: 'KeyVals',
		url: 'https://beacon.wikia-services.com/__track/special/keyvals',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_AD_SIZE_INFO: {
		name: 'AdEngAdSizeInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengadsizeinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_LABRADOR_INFO: {
		name: 'AdEngLabradorInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adenglabradorinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_AD_INFO: {
		name: 'AdEngAdInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengadinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	IDENTITY_INFO: {
		name: 'IdentityInfo',
		url: 'https://beacon.wikia-services.com/__track/special/identityinfo',
		allowed: {
			sampling: false,
			aggregation: true,
		},
	},
	TRACKING_EVENT: {
		name: 'TrackingEvent',
		url: 'https://beacon.wikia-services.com/__track/special/trackingevent',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	VIDEO_PLAYER_EVENT: {
		name: 'VideoPlayerEvent',
		url: 'https://beacon.wikia-services.com/__track/special/videoplayerevent',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
};
