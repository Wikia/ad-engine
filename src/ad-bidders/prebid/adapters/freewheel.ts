import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Freewheel extends PrebidAdapter {
	static bidderName = 'freewheel-ssp';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Freewheel.bidderName;
	}

	prepareConfigForAdUnit(code, { zoneIds }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					labelAll: ['desktop'],
					params: {
						zoneId: zoneIds[0],
						video: {
							playerWidth: 640,
							playerHeight: 480,
							mimes: [
								'video/mp4',
								'application/javascript',
								'video/x-flv',
								'video/webm',
								'video/ogg',
							],
							protocols: [2, 3, 5, 6],
							delivery: [2],
							api: [2],
						},
					},
				},
				{
					bidder: this.bidderName,
					labelAll: ['phone'],
					params: {
						zoneId: zoneIds[1],
						minPlayerSize: [300, 50],
						maxPlayerSize: [600, 350],
					},
				},
			],
		};
	}
}
