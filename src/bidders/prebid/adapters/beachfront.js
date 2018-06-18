import { BaseAdapter } from './base-adapter';
import { queryString } from './../../../utils/query-string';

export class Beachfront extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'beachfront';
		this.bidfloor = 0.01;
		this.debugAppId = '2e55f7ad-3558-49eb-a3e1-056ccd0e74e2';
		this.isDebugMode = queryString.get('beachfront_debug_mode') === '1';
	}

	prepareConfigForAdUnit(code, { appId }) {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480]
				}
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						bidfloor: this.bidfloor,
						appId: this.isDebugMode ? this.debugAppId : appId
					}
				}
			]
		};
	}
}
