import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class Onemobile extends BaseAdapter {
	static bidderName = 'onemobile';
	siteId: string;

	get bidderName(): string {
		return Onemobile.bidderName;
	}

	constructor(options) {
		super(options);

		this.siteId = options.siteId;
	}

	prepareConfigForAdUnit(code, { size, pos }): AdUnitConfig {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes: [size],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						pos,
						dcn: this.siteId,
					},
				},
			],
		};
	}
}
