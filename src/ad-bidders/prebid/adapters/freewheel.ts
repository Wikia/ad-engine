import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

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
					placement: PrebidVideoPlacements.IN_ARTICLE,
					plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						format: 'instream',
						zoneId,
						vastUrlParams: {
							protocolVersion: '4.2',
						},
					},
				},
			],
		};
	}
}
