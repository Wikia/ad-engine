import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class Lkqd extends BaseAdapter {
	static bidderName = 'lkqd';

	get bidderName(): string {
		return Lkqd.bidderName;
	}

	prepareConfigForAdUnit(code, { placementId, siteId }): AdUnitConfig {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						siteId,
						placementId,
						pageurl: window.location.hostname,
						output: 'svpaid',
					},
				},
			],
		};
	}
}
