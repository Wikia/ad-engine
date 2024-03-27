// @ts-strict-ignore
import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class TestBidder extends PrebidAdapter {
	static bidderName = 'testBidder';
	aliases = {};

	constructor(options) {
		super(options);

		this.aliases[context.get('bidders.prebid.testBidder.name')] = [TestBidder.bidderName];
	}

	get bidderName(): string {
		return TestBidder.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, parameters }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, parameters);
		}
		const newSizes = this.filterSizesForRefreshing(code, sizes);
		return this.getStandardConfig(code, { sizes: newSizes, parameters });
	}

	private getVideoConfig(code, parameters): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					playerSize: [640, 480],
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {
						...parameters,
					},
				},
			],
		};
	}

	private getStandardConfig(code, { sizes, parameters }): PrebidAdUnit {
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
						...parameters,
					},
				},
			],
		};
	}
}
