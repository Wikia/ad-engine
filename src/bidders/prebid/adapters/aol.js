import { BaseAdapter } from './base-adapter';

export class Aol extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'aol';
		this.network = '9435.1';
	}

	prepareConfigForAdUnit(code, {
		sizes, placement, alias, sizeId
	}) {
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
						placement,
						network: this.network,
						alias,
						sizeId
					}
				}
			]
		};
	}
}
