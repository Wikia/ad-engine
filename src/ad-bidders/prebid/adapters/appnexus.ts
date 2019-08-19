import { context, Dictionary } from '@ad-engine/core';
import { BaseAdapter } from './base-adapter';

export class Appnexus extends BaseAdapter {
	static bidderName = 'appnexus';
	placements: Dictionary<string>;

	constructor(options) {
		super(options);

		this.placements = options.placements;
	}

	get bidderName(): string {
		return Appnexus.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, placementId, position = 'mobile' }): PrebidAdUnit {
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
						placementId: placementId || this.getPlacement(position),
					},
				},
			],
			sizes: [],
		};
	}

	getPlacement(position): string {
		let placement = position;

		if (position === 'mobile') {
			const vertical = context.get('targeting.mappedVerticalName');

			placement = vertical && this.placements[vertical] ? vertical : 'other';
		}

		return this.placements[placement];
	}
}
