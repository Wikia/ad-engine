import { PrebidAdapter } from '../prebid-adapter';

export class Lkqd extends PrebidAdapter {
	static bidderName = 'lkqd';

	get bidderName(): string {
		return Lkqd.bidderName;
	}

	prepareConfigForAdUnit(code, { placementId, siteId }): PrebidAdUnit {
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
