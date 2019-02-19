import { getTargeting } from '../prebid-helper';
import { BaseAdapter } from './base-adapter';

export class RubiconDisplay extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'rubicon_display';
		this.aliases = {
			rubicon: [this.bidderName],
		};
		this.accountId = options.accountId;
	}

	prepareConfigForAdUnit(code, { siteId, zoneId, sizes, position, targeting }) {
		const pageTargeting = getTargeting(code);

		Object.keys(targeting || {}).forEach((key) => {
			pageTargeting[key] = targeting[key];
		});

		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
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
						inventory: pageTargeting,
					},
				},
			],
		};
	}
}
