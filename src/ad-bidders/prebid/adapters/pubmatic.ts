import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class Pubmatic extends PrebidAdapter {
	static bidderName = 'pubmatic';
	publisherId: string;

	constructor(options) {
		super(options);

		this.publisherId = options.publisherId;
	}

	get bidderName(): string {
		return Pubmatic.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, ids }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, ids);
		}

		return this.getStandardConfig(code, sizes, ids);
	}

	getVideoConfig(code, ids): PrebidAdUnit {
		const videoParams = {
			video: {
				mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
				skippable: true,
				minduration: 1,
				maxduration: 30,
				startdelay: 0,
				playbackmethod: [2, 3],
				api: [2],
				protocols: [2, 3, 5, 6],
				linearity: 1,
				placement: PrebidVideoPlacements.IN_ARTICLE,
				plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
			},
		};

		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
					placement: PrebidVideoPlacements.IN_ARTICLE,
				},
			},
			bids: this.getBids(ids, videoParams),
		};
	}

	getStandardConfig(code, sizes, ids): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: this.getBids(ids),
		};
	}

	getBids(ids, params = {}): PrebidBid[] {
		return ids.map((adSlot) => ({
			bidder: this.bidderName,
			params: {
				adSlot,
				publisherId: this.publisherId,
				...params,
			},
		}));
	}
}
