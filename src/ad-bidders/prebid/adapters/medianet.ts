import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Medianet extends PrebidAdapter {
	static bidderName = 'medianet';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Medianet.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, cid, crid }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, cid, crid);
		}

		return this.getStandardConfig(code, sizes, cid, crid);
	}

	private getVideoConfig(code, cid, crid): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
					api: [2],
					linearity: 1,
					mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
					maxduration: 30,
					protocols: [2, 3, 5, 6],
					playbackmethod: [2, 3],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						cid,
						crid,
						video: {
							w: '640',
							h: '480',
							mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
							playbackmethod: [2, 3],
							maxduration: 30,
							minduration: 1,
							startdelay: 0,
						},
					},
				},
			],
		};
	}

	private getStandardConfig(code, sizes, cid, crid): PrebidAdUnit {
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
						cid,
						crid,
					},
				},
			],
		};
	}
}
