import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Freewheel extends PrebidAdapter {
	static bidderName = 'freewheel';
	aliases = {
		'freewheel-ssp': [Freewheel.bidderName],
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Freewheel.bidderName;
	}

	prepareConfigForAdUnit(code, { zoneId }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						zoneId,
						format: 'instream',
					},
				},
			],
		};
	}
}
