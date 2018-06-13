import { BaseAdapter } from './base-adapter';

export class Appnexus extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'appnexus';
		this.placementMap = options.placementMap;
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
