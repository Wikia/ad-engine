import { PrebidAdapter } from '../prebid-adapter';

export class RubiconDisplay extends PrebidAdapter {
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

	prepareConfigForAdUnit(code, { siteId, zoneId, sizes, position, targeting }): PrebidAdUnit {
		const pageTargeting = this.getTargeting(code);

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
