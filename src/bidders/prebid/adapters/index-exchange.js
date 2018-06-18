import { BaseAdapter } from './base-adapter';

export class IndexExchange extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'indexExchange';
		this.aliases = {
			ix: [this.bidderName]
		};
		/* this.recoveryConfig = {
			TOP_LEADERBOARD: {
				sizes: [
					[728, 90],
					[970, 250]
				],
				siteId: 215807
			},
			TOP_RIGHT_BOXAD: {
				sizes: [
					[300, 250],
					[300, 600]
				],
				siteId: 215808
			},
			INCONTENT_BOXAD_1: {
				sizes: [
					[160, 600],
					[300, 600],
					[300, 250]
				],
				siteId: 215809
			},
			BOTTOM_LEADERBOARD: {
				sizes: [
					[728, 90],
					[970, 250]
				],
				siteId: 215810
			}
		}; */
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
