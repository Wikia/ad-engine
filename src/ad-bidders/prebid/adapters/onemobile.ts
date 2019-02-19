import { BaseAdapter } from './base-adapter';

export class Onemobile extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'onemobile';
		this.siteId = options.siteId;
	}

	prepareConfigForAdUnit(code, { size, pos }) {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes: [size],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						dcn: this.siteId,
						pos,
					},
				},
			],
		};
	}
}
