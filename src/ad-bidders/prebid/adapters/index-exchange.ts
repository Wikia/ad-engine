import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class IndexExchange extends PrebidAdapter {
	static bidderName = 'indexExchange';
	aliases = {
		ix: [IndexExchange.bidderName],
	};
	bidderSettings = {
		storageAllowed: true,
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return IndexExchange.bidderName;
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
					plcmt: [PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT],
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
							context: 'instream',
							playerSize: [640, 480],
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
							w: 640,
							h: 480,
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
			bids: this.getBids(sizes, siteId),
		};
	}

	private getBids(sizes, siteId): PrebidBid[] {
		if (Array.isArray(siteId) && siteId.length > 0) {
			return this.getBidsForMultipleSiteIds(sizes, siteId);
		}

		return sizes.map((size) => ({
			bidder: this.bidderName,
			params: {
				siteId,
				size,
			},
		}));
	}

	private getBidsForMultipleSiteIds(sizes, siteId): PrebidBid[] {
		return siteId.map((id, idx) => ({
			bidder: this.bidderName,
			params: {
				size: sizes[idx],
				siteId: id,
			},
		}));
	}
}
