interface BigFancyAdConfig {
	aspectRatio: {
		default: number;
		resolved: number;
	};
	images: {
		boxad300x250: string;
		boxad300x600?: string;
		default: string;
		resolved?: string;
	};
}

export interface FanTakeoverCampaignConfig {
	desktop: BigFancyAdConfig;
	mobile: BigFancyAdConfig;
	autoplay: boolean;
	clickThroughUrl: string;
	thumbnail?: string;
	vast?: string;
	campaignId: string;
}

export class SafeFanTakeoverConfigLoader {
	async loadConfig(campaignId: string): Promise<FanTakeoverCampaignConfig> {
		// FETCHING CONFIG PART GOES HERE
		// TODO ADEN-10312: take campaignId from params.campaignId and fetch config from some endpoint
		return {
			desktop: {
				aspectRatio: {
					default: 4,
					resolved: 10,
				},
				images: {
					boxad300x250:
						'//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/boxad.jpg',
					default:
						'//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/impact.jpg',
					resolved:
						'//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/resolved.jpg',
				},
			},
			mobile: {
				aspectRatio: {
					default: 1.7777777778,
					resolved: 3,
				},
				images: {
					boxad300x250:
						'//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/boxad.jpg',
					default:
						'//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/impact-mobile.jpg',
				},
			},
			autoplay: true,
			clickThroughUrl: 'https://fandom.com/',
			thumbnail:
				'//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/thumbnail.jpg',
			vast: '//static.nocookie.net/fandom-ae-assets/programmatic/latest/campaign/1/vast.xml',
			campaignId,
		};
	}
}
