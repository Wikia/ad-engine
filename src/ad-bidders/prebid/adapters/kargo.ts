import { BaseAdapter } from './base-adapter';

export class Kargo extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'kargo';
	}

	prepareConfigForAdUnit(code, { sizes, placementId }) {
		return {
			code,
			sizes,
			bids: [
				{
					bidder: this.bidderName,
					params: {
						placementId,
					},
				},
			],
		};
	}
}
