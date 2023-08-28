import { PrebidAdapter } from '../prebid-adapter';

export class Ozone extends PrebidAdapter {
	static bidderName = 'ozone';
	dcn: string;

	constructor(options) {
		super(options);
		this.dcn = options.dcn;
	}

	get bidderName(): string {
		return Ozone.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, pos }): PrebidAdUnit {
		return {
			code: code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: [
				{
					bidder: 'ozone',
					params: {
						publisherId: 'OZONETEST001',
						siteId: '4204204201',
						placementId: '0420420421',
						pos,
					},
				},
			],
		};
	}
}
