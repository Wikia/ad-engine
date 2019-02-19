import { utils } from '@wikia/ad-engine';
import { BaseAdapter } from './base-adapter';

export class Beachfront extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'beachfront';
		this.bidfloor = 0.01;
		this.debugAppId = options.debugAppId;
		this.isDebugMode = utils.queryString.get('beachfront_debug_mode') === '1';
	}

	prepareConfigForAdUnit(code, { appId }) {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					playerSize: [640, 480],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						bidfloor: this.bidfloor,
						appId: this.isDebugMode ? this.debugAppId : appId,
					},
				},
			],
		};
	}
}
