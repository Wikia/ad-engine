import { PrebidAdUnit } from '@ad-engine/core';
import { BaseAdapter } from './base-adapter';

export class Aol extends BaseAdapter {
	static bidderName = 'aol';
	network: string;

	get bidderName(): string {
		return Aol.bidderName;
	}

	constructor(options) {
		super(options);

		this.network = options.network;
	}

	prepareConfigForAdUnit(code, { sizes, placement, alias, sizeId }): PrebidAdUnit {
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
						alias,
						placement,
						sizeId,
						network: this.network,
					},
				},
			],
			sizes: [],
		};
	}
}
