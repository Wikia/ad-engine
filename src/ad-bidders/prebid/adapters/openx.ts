import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class Openx extends BaseAdapter {
	static bidderName = 'openx';
	delDomain: string;

	get bidderName(): string {
		return Openx.bidderName;
	}

	constructor(options) {
		super(options);

		this.delDomain = options.delDomain;
	}

	prepareConfigForAdUnit(code, { sizes, unit }): AdUnitConfig {
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
						unit,
						delDomain: this.delDomain,
					},
				},
			],
		};
	}
}
