import { BaseAdapter } from './base-adapter';

export class Lkqd extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'lkqd';
	}

	prepareConfigForAdUnit(code, { placementId, siteId }) {
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
