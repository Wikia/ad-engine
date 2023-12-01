import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class WebAds extends PrebidAdapter {
	static bidderName = 'relevantdigital';
	private accountId = '647765b7705d4fca3b3e1d58';
	bidderSettings = {
		storageAllowed: true,
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return WebAds.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, placementId }: PrebidAdSlotConfig): PrebidAdUnit {
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
						placementId,
						accountId: this.accountId,
						pbsHost: 'webads-pbs.relevant-digital.com',
					},
				},
			],
		};
	}
}
