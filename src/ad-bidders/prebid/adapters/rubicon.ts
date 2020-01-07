import { context } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';

export class Rubicon extends PrebidAdapter {
	static bidderName = 'rubicon';
	accountId: number;
	maxCpm = EXTENDED_MAX_CPM;

	get bidderName(): string {
		return Rubicon.bidderName;
	}

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
	}

	prepareConfigForAdUnit(code, { siteId, zoneId, sizeId, position }): PrebidAdUnit {
		if (code === 'featured' && !context.get('custom.rubiconInFV')) {
			return null;
		}

		const targeting = this.getTargeting(code);

		return {
			code,
			mediaType: 'video',
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
					api: [2],
					linearity: 1,
					mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
					maxduration: 30,
					protocols: [2, 3, 5, 6],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						position,
						siteId,
						zoneId,
						accountId: this.accountId,
						name: code,
						inventory: targeting,
						video: {
							playerWidth: '640',
							playerHeight: '480',
							size_id: sizeId,
							language: targeting.lang ? targeting.lang[0] : 'en',
						},
					},
				},
			],
		};
	}
}
