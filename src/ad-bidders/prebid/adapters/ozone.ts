// @ts-strict-ignore
import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
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
			this.setTargeting();
		}
	}

	get bidderName(): string {
		return Ozone.bidderName;
	}

	private setTargeting() {
		const ozoneContext = context.get('bidders.prebid.ozone');
		if (ozoneContext && ozoneContext.slots) {
			Object.keys(ozoneContext.slots).forEach((slotName) => {
				targetingService.set('testgroup', this.testGroup, slotName);
			});

			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					if (action.adProduct && action.adProduct !== 'none') {
						Object.keys(ozoneContext.slots).forEach((slotName) => {
							targetingService.remove('testgroup', slotName);
						});
					}
				},
			);
		}
	}

	prepareConfigForAdUnit(code, { sizes, pos, placementId }: PrebidAdSlotConfig): PrebidAdUnit {
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
