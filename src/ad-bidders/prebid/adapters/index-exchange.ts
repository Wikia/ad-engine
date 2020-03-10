import { context } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';

export class IndexExchange extends PrebidAdapter {
	static bidderName = 'indexExchange';
	aliases = {
		ix: [IndexExchange.bidderName],
	};
	maxCpm = EXTENDED_MAX_CPM;

	get bidderName(): string {
		return IndexExchange.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, siteId }): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, siteId);
		}

		return this.getStandardConfig(code, { sizes, siteId });
	}

	getVideoConfig(code, siteId): PrebidAdUnit {
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
							mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
							minduration: 1,
							maxduration: 30,
							protocols: [2, 3, 5, 6],
						},
					},
				},
			],
		};
	}

	getStandardConfig(code, { sizes, siteId }): PrebidAdUnit {
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
