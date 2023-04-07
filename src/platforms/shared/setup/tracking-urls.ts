import { Dictionary } from '@wikia/ad-engine';

interface TrackingConfigOfAllowedOptions {
	sampling: boolean;
	aggregation: boolean;
}

export interface TrackingUrl {
	name: string;
	icbmName: string;
	url: string;
	allowed: TrackingConfigOfAllowedOptions;
}

export const trackingUrls: Dictionary<TrackingUrl> = {
	AD_ENG_LOAD_TIMES: {
		name: 'AdEngLoadTimes',
		icbmName: 'loadTimes',
		url: 'https://beacon.wikia-services.com/__track/special/adengloadtimes',
		allowed: {
			sampling: true,
			aggregation: true,
		},
	},
	AD_ENG_BIDDERS: {
		name: 'AdEngBidders',
		icbmName: 'bidders',
		url: 'https://beacon.wikia-services.com/__track/special/adengbidders',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_VIEWABILITY: {
		name: 'AdEngViewability',
		icbmName: 'viewability',
		url: 'https://beacon.wikia-services.com/__track/special/adengviewability',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_PLAYER_INFO: {
		name: 'AdEngPlayerInfo',
		icbmName: 'playerInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengplayerinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	KEY_VALS: {
		name: 'KeyVals',
		icbmName: 'kvs',
		url: 'https://beacon.wikia-services.com/__track/special/keyvals',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_AD_SIZE_INFO: {
		name: 'AdEngAdSizeInfo',
		icbmName: 'adSizeInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengadsizeinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_LABRADOR_INFO: {
		name: 'AdEngLabradorInfo',
		icbmName: 'labrador',
		url: 'https://beacon.wikia-services.com/__track/special/adenglabradorinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	AD_ENG_AD_INFO: {
		name: 'AdEngAdInfo',
		icbmName: 'adInfo',
		url: 'https://beacon.wikia-services.com/__track/special/adengadinfo',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	IDENTITY_INFO: {
		name: 'IdentityInfo',
		icbmName: 'idInfo',
		url: 'https://beacon.wikia-services.com/__track/special/identityinfo',
		allowed: {
			sampling: false,
			aggregation: true,
		},
	},
	TRACKING_EVENT: {
		name: 'TrackingEvent',
		icbmName: 'trackingEvent',
		url: 'https://beacon.wikia-services.com/__track/special/trackingevent',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
	VIDEO_PLAYER_EVENT: {
		name: 'VideoPlayerEvent',
		icbmName: 'videoPlayerEvent',
		url: 'https://beacon.wikia-services.com/__track/special/videoplayerevent',
		allowed: {
			sampling: false,
			aggregation: false,
		},
	},
};
