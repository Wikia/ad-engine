import { BaseAdapter } from './base-adapter';

export class IndexExchange extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'indexExchange';
		this.aliases = {
			ix: [this.bidderName]
		};
	}

	prepareConfigForAdUnit(code, { sizes, siteId }) {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes
				}
			},
			bids: sizes.map(size => ({
				bidder: this.bidderName,
				params: {
					siteId,
					size
				}
			}))
		};
	}
}
