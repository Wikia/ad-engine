import { context, Dictionary, TargetingData, targetingService } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class RubiconDisplay extends PrebidAdapter {
	static bidderName = 'rubicon_display';
	aliases = {
		rubicon: [RubiconDisplay.bidderName],
	};
	accountId: number;
	customTargeting: Dictionary;

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
		this.customTargeting = {
			s1: [
				context.get('wiki.targeting.wikiIsTop1000')
					? targetingService.dumpTargeting<TargetingData>().s1 || ''
					: 'not a top1k wiki',
			],
			lang: [
				targetingService.dumpTargeting<TargetingData>().wikiLanguage ||
					targetingService.dumpTargeting<TargetingData>().lang ||
					'en',
			],
		};
	}

	get bidderName(): string {
		return RubiconDisplay.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ siteId, zoneId, sizes, position, targeting }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
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
						keywords: ['rp.fastlane'],
						inventory: {
							...this.getTargeting(code, { ...(targeting || {}), ...this.customTargeting }),
						},
					},
				},
			],
		};
	}
}
