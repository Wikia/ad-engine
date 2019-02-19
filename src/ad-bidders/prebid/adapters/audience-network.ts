import { utils } from '@wikia/ad-engine';
import { BaseAdapter } from './base-adapter';

export class AudienceNetwork extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'audienceNetwork';
		this.testMode = utils.queryString.get('audiencenetworktest') === 'true';
	}

	prepareConfigForAdUnit(code, { sizes, placementId }) {
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
						testMode: this.testMode,
						placementId,
					},
				},
			],
		};
	}
}
