import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class Roundel extends PrebidAdapter {
	static bidderName = 'roundel';
	aliases = {
		ix: [Roundel.bidderName],
	};
	bidderSettings = {
		storageAllowed: true,
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Roundel.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, siteId }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, siteId);
		}

		return this.getStandardConfig(code, { sizes, siteId });
	}

	private getVideoConfig(code, siteId): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					placement: PrebidVideoPlacements.IN_ARTICLE,
					playerSize: [640, 480],
					plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {
						siteId,
						size: [640, 480],
						video: {
							mimes: [
								'video/mp4',
								'video/x-flv',
								'video/webm',
								'video/ogg',
								'application/javascript',
							],
							minduration: 1,
							maxduration: 30,
							protocols: [2, 3, 5, 6],
							api: [2],
						},
					},
				},
			],
		};
	}

	private getStandardConfig(code, { sizes, siteId }): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: sizes.map((size) => ({
				bidder: this.bidderName,
				params: {
					siteId,
					size,
				},
			})),
		};
	}
}
