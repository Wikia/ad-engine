import { BaseAdapter } from './base-adapter';

export class Onemobile extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'onemobile';
		this.siteId = '2c9d2b50015e5e9a6540a64f3eac0266';
	}

	prepareConfigForAdUnit(code, { sizes, pos }) {
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
						dcn: this.siteId,
						pos
					}
				}
			]
		};
	}
}
