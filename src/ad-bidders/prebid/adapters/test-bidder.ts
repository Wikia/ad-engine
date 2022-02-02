import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { context } from '@ad-engine/core';

export class TestBidder extends PrebidAdapter {
	static bidderName = 'testBidder';
	aliases = {
		appnexus: [TestBidder.bidderName],
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return TestBidder.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, parameters }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isVideo`)) {
			return this.getVideoConfig(code, parameters);
		}

		return this.getStandardConfig(code, { sizes, parameters });
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
