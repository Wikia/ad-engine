import { PrebidAdapter } from '../prebid-adapter';

export class Verizon extends PrebidAdapter {
	static bidderName = 'verizon';
	dcn: string;

	constructor(options) {
		super(options);

		this.dcn = options.dcn;
	}

	get bidderName(): string {
		return Verizon.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, pos }): PrebidAdUnit {
		const newSizes = this.filterSizesForRefreshing(code, sizes);
		return {
			code,
			mediaTypes: {
				banner: {
					sizes: newSizes,
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						pos,
						dcn: this.dcn,
					},
				},
			],
		};
	}
}
