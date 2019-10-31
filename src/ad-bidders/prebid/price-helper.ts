import { Dictionary } from '@ad-engine/core';
import { mapValues } from 'lodash';
import { adaptersRegistry } from './adapters-registry';
import { DEFAULT_MAX_CPM } from './prebid-adapter';
import { getWinningBid } from './prebid-helper';

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
 * Round cpm to predefined values and transform to string with 2 decimal places.
 */
export function transformPriceFromCpm(cpm: number, maxCpm: number = DEFAULT_MAX_CPM): string {
	const price = Math.max(maxCpm, DEFAULT_MAX_CPM);

	return roundCpm(cpm, price).toFixed(2);
}

export async function getPrebidBestPrice(slotName: string): Promise<Dictionary<string>> {
	const bestPrices: Dictionary<number> = {};
	const prebidAdapters = adaptersRegistry.getAdapters();

	for (const adapter of Array.from(prebidAdapters.entries())) {
		const winningBid = await getWinningBid(slotName, adapter[1].bidderName);
		const { hb_pb } = winningBid;

		bestPrices[adapter[1].bidderName] = hb_pb ? parseFloat(hb_pb) : 0;
	}

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
