import { BaseAdapter } from './base-adapter';
import { queryString } from './../../../utils/query-string';

export class AudienceNetwork extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'audienceNetwork';
		this.testMode = queryString.get('audiencenetworktest') === 'true';
	}

	prepareConfigForAdUnit(code, { sizes, placementId }) {
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
						testMode: this.testMode,
						placementId
					}
				}
			]
		};
	}
}
