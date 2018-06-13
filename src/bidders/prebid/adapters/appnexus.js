import { BaseAdapter } from './base-adapter';
import { context } from './../../../services/context-service';

export class Appnexus extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'appnexus';
		this.placements = options.placements;
		/* this.recoveryPlacements = {
			atf: '11823778',
			btf: '11823724',
			hivi: '11823799'
		} */
	}

	prepareConfigForAdUnit(code, { sizes, position = 'mobile' }) {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes
				}
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						placementId: this.getPlacement(position)
					}
				}
			]
		};
	}

	getPlacement(position) {
		if (position === 'mobile') {
			const vertical = context.get('targeting.mappedVerticalName');

			position = vertical && this.placements[vertical] ? vertical : 'other';
		}

		return this.placements[position];
	}
}
