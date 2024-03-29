// @ts-strict-ignore
import { context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class Rubicon extends PrebidAdapter {
	static bidderName = 'rubicon';
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
		return Rubicon.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ siteId, zoneId, sizeId, position }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		if (code === 'featured' && !context.get('custom.hasFeaturedVideo')) {
			return null;
		}

		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
					api: [2],
					linearity: 1,
					mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
					maxduration: 30,
					protocols: [2, 3, 5, 6],
					placement: PrebidVideoPlacements.IN_ARTICLE,
					plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {
						position,
						siteId,
						zoneId,
						accountId: this.accountId,
						name: code,
						inventory: {
							...this.getTargeting(code, this.customTargeting),
						},
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
