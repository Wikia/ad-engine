import { context, Dictionary } from '@ad-engine/core';
// tslint:disable-next-line:no-blacklisted-paths
import { permutive } from '@ad-engine/services';
import { PrebidAdapter } from '../prebid-adapter';

export class Appnexus extends PrebidAdapter {
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
						keywords: this.getAdditionalKeyVals(code),
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

	private getAdditionalKeyVals(code): object {
		if (context.get('bidders.prebid.additionalKeyvals.appnexus')) {
			return {
				p_standard: permutive.getPermutiveKeys(),
				...this.getTargeting(code),
			};
		}

		return {};
	}
}
