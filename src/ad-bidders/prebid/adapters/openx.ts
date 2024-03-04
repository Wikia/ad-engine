import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class Openx extends PrebidAdapter {
	static bidderName = 'openx';
	delDomain: string;

	constructor(options) {
		super(options);

		this.delDomain = options.delDomain;
	}

	get bidderName(): string {
		return Openx.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, unit }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, unit);
		}

		return this.getStandardConfig(code, sizes, unit);
	}

	private getVideoConfig(code, unit): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					mimes: ['video/mp4', 'video/x-flv'],
					playerSize: [640, 480],
					placement: PrebidVideoPlacements.IN_ARTICLE,
					plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {
						unit,
						delDomain: this.delDomain,
					},
				},
			],
			debugInfo: unit,
		};
	}

	private getStandardConfig(code, sizes, unit): PrebidAdUnit {
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
						unit,
						delDomain: this.delDomain,
					},
				},
			],
			debugInfo: unit,
		};
	}
}
