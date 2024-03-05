import { context, Dictionary, targetingService } from '@ad-engine/core';
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
					? targetingService.get('s1') || ''
					: 'not a top1k wiki',
			],
			lang: [targetingService.get('wikiLanguage') || targetingService.get('lang') || 'en'],
		};
	}

	get bidderName(): string {
		return RubiconDisplay.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ siteId, zoneId, sizes, position, targeting }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		const newSizes = this.filterSizesForRefreshing(code, sizes);

		return {
			code,
			mediaTypes: {
				banner: {
					sizes: newSizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: this.getBids(code, position, siteId, zoneId, targeting),
		};
	}

	getBids(code, position, siteId, zoneId, targeting) {
		if (Array.isArray(zoneId) && zoneId.length > 0) {
			return zoneId.map((id) => ({
				bidder: this.bidderName,
				params: {
					position,
					siteId,
					zoneId: id,
					accountId: this.accountId,
					name: code,
					keywords: ['rp.fastlane'],
					inventory: {
						...this.getTargeting(code, { ...(targeting || {}), ...this.customTargeting }),
					},
				},
			}));
		}

		return [
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
		];
	}
}
