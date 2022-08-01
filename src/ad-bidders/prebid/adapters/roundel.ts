import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { context } from '@ad-engine/core';

export class Roundel extends PrebidAdapter {
	static bidderName = 'roundel';
	aliases = {
		ix: [Roundel.bidderName],
	};
	maxCpm = EXTENDED_MAX_CPM;

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
					playerSize: [640, 480],
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
