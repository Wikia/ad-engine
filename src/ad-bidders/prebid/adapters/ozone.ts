import { context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Ozone extends PrebidAdapter {
	static bidderName = 'ozone';
	dcn: string;
	customTargeting: Dictionary;
	private testGroup: string;

	constructor(options) {
		super(options);
		this.testGroup = Math.floor(Math.random() * 100).toString();
		this.customTargeting = {
			s1: [
				context.get('wiki.targeting.wikiIsTop1000')
					? targetingService.get('s1') || ''
					: 'not a top1k wiki',
			],
			lang: [targetingService.get('wikiLanguage') || targetingService.get('lang') || 'en'],
			testgroup: this.testGroup,
		};
		this.dcn = options.dcn;

		if (this.enabled) {
			targetingService.set('testgroup', this.testGroup);
		}
	}

	get bidderName(): string {
		return Ozone.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, pos, placementId }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code: code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: 'ozone',
					params: {
						publisherId: 'OZONEFAN0001',
						siteId: '1500000156',
						placementId: placementId,
						pos: pos,
						customData: [
							{
								settings: {},
								targeting: {
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
