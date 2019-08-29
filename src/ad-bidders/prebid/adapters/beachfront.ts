import { utils } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';

export class Beachfront extends PrebidAdapter {
	static bidderName = 'beachfront';
	bidfloor = 0.01;
	debugAppId: string;
	isDebugMode: boolean;

	constructor(options) {
		super(options);

		this.debugAppId = options.debugAppId;
		this.isDebugMode = utils.queryString.get('beachfront_debug_mode') === '1';
	}

	get bidderName(): string {
		return Beachfront.bidderName;
	}

	prepareConfigForAdUnit(code, { appId }): PrebidAdUnit {
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
