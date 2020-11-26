import { context, Dictionary } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';

export class RubiconDisplay extends PrebidAdapter {
	static bidderName = 'rubicon_display';

	aliases = {
		rubicon: [RubiconDisplay.bidderName],
	};
	accountId: number;
	customTargeting: Dictionary;

	get bidderName(): string {
		return RubiconDisplay.bidderName;
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

	prepareConfigForAdUnit(code, { siteId, zoneId, sizes, position, targeting }): PrebidAdUnit {
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
						inventory: context.get('bidders.prebid.additionalKeyvals.rubicon')
							? this.getTargeting(code, { ...(targeting || {}), ...this.customTargeting })
							: {},
					},
				},
			],
		};
	}
}
