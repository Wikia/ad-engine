import { context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Ozone extends PrebidAdapter {
	static bidderName = 'ozone';
	dcn: string;
	customTargeting: Dictionary;

	constructor(options) {
		super(options);
		this.customTargeting = {
			s1: [
				context.get('wiki.targeting.wikiIsTop1000')
					? targetingService.get('s1') || ''
					: 'not a top1k wiki',
			],
			lang: [targetingService.get('wikiLanguage') || targetingService.get('lang') || 'en'],
		};
		this.dcn = options.dcn;
	}

	get bidderName(): string {
		return Ozone.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, pos }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code: code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: [
				{
					bidder: 'ozone',
					params: {
						publisherId: 'OZONETEST001',
						siteId: '4204204201',
						placementId: '8000000326',
						pos,
						customData: [
							{
								settings: {},
								targeting: {
									page_type: 'article',
									...this.getTargeting(code, this.customTargeting),
								},
							},
						],
					},
				},
			],
		};
	}
}
