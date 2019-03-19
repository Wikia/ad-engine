import { getTargeting } from '../prebid-helper';
import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class RubiconDisplay extends BaseAdapter {
	static bidderName = 'rubicon_display';
	aliases = {
		rubicon: [RubiconDisplay.bidderName],
	};

	accountId: number;

	get bidderName(): string {
		return RubiconDisplay.bidderName;
	}

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
	}

	prepareConfigForAdUnit(code, { siteId, zoneId, sizes, position, targeting }): AdUnitConfig {
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
					bidder: RubiconDisplay.bidderName,
					params: {
						position,
						siteId,
						zoneId,
						accountId: this.accountId,
						name: code,
						keywords: ['rp.fastlane'],
						inventory: pageTargeting,
					},
				},
			],
		};
	}
}
