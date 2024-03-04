import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class Seedtag extends PrebidAdapter {
	static bidderName = 'seedtag';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Seedtag.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ sizes, publisherId, adUnitId, placement = 'inBanner' }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, publisherId, adUnitId);
		}

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
						publisherId,
						adUnitId,
						placement,
					},
				},
			],
			debugInfo: adUnitId,
		};
	}

	getVideoConfig(code, publisherId, adUnitId): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
					mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
					skip: 1,
					minduration: 1,
					maxduration: 30,
					startdelay: 0,
					playbackmethod: [2, 3],
					linearity: 1,
					placement: PrebidVideoPlacements.IN_ARTICLE,
					plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						publisherId,
						adUnitId,
						placement: 'inStream',
					},
				},
			],
			debugInfo: adUnitId,
		};
	}
}
