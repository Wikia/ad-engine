import { context } from '@wikia/ad-engine';
import { adaptersRegistry } from './adapters-registry';
import { transformPriceFromBid } from './price-helper';

interface PrebidSettings {
	[key: string]: {
		adserverTargeting: {
			key: string;
			val: (bidResponse: any) => string;
		}[];
		suppressEmptyKeys: boolean;
	};
}

export interface PrebidTargeting {
	hb_adid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	hb_size?: string;
	[key: string]: string | string[];
}

export function createAdapterSpecificSettings(adaptersList): PrebidSettings | undefined {
	const adaptersAdServerTargeting = {};

	if (!context.get('bidders.prebid.useBuiltInTargetingLogic')) {
		return;
	}

	adaptersList.forEach(({ bidderName }) => {
		if (!bidderName) {
			return;
		}

		adaptersAdServerTargeting[bidderName] = {
			adserverTargeting: [
				{
					key: `hb_deal_${bidderName}`,
					val: ({ dealId }) => {
						return dealId;
					},
				},
			],
			suppressEmptyKeys: true,
		};
	});

	return adaptersAdServerTargeting;
}

export function getSettings(): PrebidSettings {
	return {
		standard: {
			adserverTargeting: [
				{
					key: 'hb_bidder',
					val: ({ bidderCode }) => bidderCode,
				},
				{
					key: 'hb_adid',
					val: ({ adId }) => adId,
				},
				{
					key: 'hb_pb',
					val: (bidResponse) => transformPriceFromBid(bidResponse),
				},
				{
					key: 'hb_size',
					val: ({ size }) => size,
				},
			],
			suppressEmptyKeys: true,
		},
		...createAdapterSpecificSettings(adaptersRegistry.getAdapters()),
	};
}
