import { Dictionary, pbjsFactory } from '@ad-engine/core';
import { mapValues } from 'lodash';
import { adaptersRegistry } from './adapters-registry';
import { PrebidProvider } from './index';
import { DEFAULT_MAX_CPM } from './prebid-adapter';

function isValidPrice(bid: PrebidBidResponse): boolean {
	return bid.getStatusCode && bid.getStatusCode() === PrebidProvider.validResponseStatusCode;
}

/**
 * Round cpm to predefined values.
 */
function roundCpm(cpm: number, maxCpm: number): number {
	let result: number = Math.floor(maxCpm);

	if (cpm === 0) {
		result = 0.0;
	} else if (cpm < 0.05) {
		result = 0.01;
	} else if (cpm < 5.0) {
		result = Math.floor(cpm * 20) / 20;
	} else if (cpm < 10.0) {
		result = Math.floor(cpm * 10) / 10;
	} else if (cpm < 20.0) {
		result = Math.floor(cpm * 2) / 2;
	} else if (cpm < maxCpm) {
		result = Math.floor(cpm);
	}

	return result;
}

/**
 * Round cpm to predefined values and transform to String with 2 decimal places.
 */
export function transformPriceFromCpm(cpm: number, maxCpm: number = DEFAULT_MAX_CPM): string {
	maxCpm = Math.max(maxCpm, DEFAULT_MAX_CPM);

	return roundCpm(cpm, maxCpm).toFixed(2);
}

export async function getPrebidBestPrice(slotName: string): Promise<Dictionary<string>> {
	const pbjs: Pbjs = await pbjsFactory.init();
	const bestPrices: Dictionary<number> = {};
	const slotBids: PrebidBidResponse[] = pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

	adaptersRegistry.getAdapters().forEach((adapter) => {
		bestPrices[adapter.bidderName] = 0;
	});

	slotBids
		.filter((bid) => isValidPrice(bid) && bid.status !== 'rendered')
		.forEach((bid) => {
			const { bidderCode, cpm } = bid;
			const cmpPrice = Math.max(bestPrices[bidderCode] || 0, roundCpm(cpm, DEFAULT_MAX_CPM));

			if (cmpPrice > 0) {
				bestPrices[bidderCode] = cmpPrice;
			}
		});

	return mapValues(bestPrices, (price: number) => {
		return price === 0 ? '' : price.toFixed(2);
	});
}

export function transformPriceFromBid(bid): string {
	const bidder = adaptersRegistry.getAdapter(bid.bidderCode);
	let maxCpm = DEFAULT_MAX_CPM;

	if (bidder && bidder.maxCpm) {
		maxCpm = bidder.maxCpm;
	}

	return transformPriceFromCpm(bid.cpm, maxCpm);
}
