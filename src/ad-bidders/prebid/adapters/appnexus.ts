import { context } from '@wikia/ad-engine';
import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class Appnexus extends BaseAdapter {
	static bidderName = 'appnexus';
	placements: { [key: string]: string };

	constructor(options) {
		super(options);

		this.placements = options.placements;
	}

	get bidderName(): string {
		return Appnexus.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, position = 'mobile' }): AdUnitConfig {
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
						placementId: this.getPlacement(position),
					},
				},
			],
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
