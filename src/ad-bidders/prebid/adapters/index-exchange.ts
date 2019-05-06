import { AdUnitConfig, BaseAdapter, EXTENDED_MAX_CPM } from './base-adapter';

export class IndexExchange extends BaseAdapter {
	static bidderName = 'indexExchange';
	aliases = {
		ix: [IndexExchange.bidderName],
	};
	maxCpm = EXTENDED_MAX_CPM;

	get bidderName(): string {
		return IndexExchange.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, siteId }): AdUnitConfig {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: sizes.map((size) => ({
				bidder: this.bidderName,
				params: {
					siteId,
					size,
				},
			})),
		};
	}
}
