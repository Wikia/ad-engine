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
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
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
