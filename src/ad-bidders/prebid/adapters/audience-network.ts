import { utils } from '@wikia/ad-engine';
import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class AudienceNetwork extends BaseAdapter {
	static bidderName = 'audienceNetwork';
	testMode = false;

	constructor(options) {
		super(options);

		this.testMode = utils.queryString.get('audiencenetworktest') === 'true';
	}

	get bidderName(): string {
		return AudienceNetwork.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, placementId }): AdUnitConfig {
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
						placementId,
						testMode: this.testMode,
					},
				},
			],
		};
	}
}
