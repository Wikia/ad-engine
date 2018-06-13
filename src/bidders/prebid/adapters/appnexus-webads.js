import { BaseAdapter } from './base-adapter';

export class AppnexusWebads extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'appnexusWebAds';
		this.aliases = {
			appnexus: [this.bidderName]
		};
		this.priority = 0;
	}

	prepareConfigForAdUnit(code, { placementId, sizes }) {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes
				}
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						placementId
					}
				}
			]
		};
	}
}
