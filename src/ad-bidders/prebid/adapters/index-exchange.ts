import { context, utils } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class IndexExchange extends PrebidAdapter {
	static bidderName = 'indexExchange';
	aliases = {
		ix: [IndexExchange.bidderName],
	};
	maxCpm = EXTENDED_MAX_CPM;

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

	private getGPIDValue(code: string): string {
		return utils.stringBuilder.build(context.get('adUnitId'), {
			slotConfig: {
				adProduct: code,
				group: 'PB',
				slotNameSuffix: '',
			},
		});
	}

	private getVideoConfig(code, siteId): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					playerSize: [640, 480],
				},
			},
			ortb2Imp: {
				ext: {
					gpid: this.getGPIDValue(code),
				},
			},
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
			ortb2Imp: {
				ext: {
					gpid: this.getGPIDValue(code),
				},
			},
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
