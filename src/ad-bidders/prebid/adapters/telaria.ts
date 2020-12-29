import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Telaria extends PrebidAdapter {
	static bidderName = 'telaria';

	get bidderName(): string {
		return Telaria.bidderName;
	}

	constructor(options) {
		super(options);
	}

	prepareConfigForAdUnit(code, { supplyCode, adCode }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					playerSize: [640, 480],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						supplyCode,
						adCode,
						videoId: code,
					},
				},
			],
		};
	}
}
