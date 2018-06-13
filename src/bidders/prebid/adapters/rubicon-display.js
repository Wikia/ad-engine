import { BaseAdapter } from './base-adapter';

export class RubiconDisplay extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'rubicon_display';
		this.aliases = {
			rubicon: [this.bidderName]
		};
		this.accountId = 7450;
	}

	prepareConfigForAdUnit(code, {
		siteId, zoneId, sizes, position, targeting
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
						accountId: this.accountId,
						siteId,
						zoneId,
						name: code,
						position,
						keywords: ['rp.fastlane'],
						inventory: targeting
					}
				}
			]
		};
	}
}
