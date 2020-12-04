import { context, Dictionary } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';

export class Rubicon extends PrebidAdapter {
	static bidderName = 'rubicon';

	accountId: number;
	maxCpm = EXTENDED_MAX_CPM;
	customTargeting: Dictionary;

	get bidderName(): string {
		return Rubicon.bidderName;
	}

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
		this.customTargeting = {
			s1: [
				context.get('wiki.targeting.wikiIsTop1000')
					? context.get('targeting.s1') || ''
					: 'not a top1k wiki',
			],
			lang: [context.get('targeting.wikiLanguage') || context.get('targeting.lang') || 'en'],
		};
	}

	prepareConfigForAdUnit(code, { siteId, zoneId, sizeId, position }): PrebidAdUnit {
		if (code === 'featured' && !context.get('custom.rubiconInFV')) {
			return null;
		}

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
						inventory: context.get('bidders.prebid.additionalKeyvals.rubicon')
							? this.getTargeting(code, this.customTargeting)
							: {},
						video: {
							playerWidth: '640',
							playerHeight: '480',
							size_id: sizeId,
							language: this.customTargeting['lang'][0],
						},
					},
				},
			],
		};
	}
}
