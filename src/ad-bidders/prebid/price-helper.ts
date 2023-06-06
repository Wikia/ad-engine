import { Dictionary } from '@ad-engine/core';
import { adaptersRegistry } from './adapters-registry';
import { getWinningBid } from './prebid-helper';

/**
 * Used with pbjs.setConfig({'cpmRoundingFunction'}) to set all CPMs below 0.05 into 0.01 bucket.
 *
 * Rounding is called by Prebid.js with CPM adjusted to bucketCpm = (CPM - bucket.min) / bucket.increment,
 * with all values lifted up by 10 ^ (precision + 2). Then the rounded value rCPM is put into the price
 * bucket by reverse calculation e.g. bucket_price = bucket.min + rCPM * bucket.increment.
 *
 * For the lowest bucket configured 0.05 and increment 0.1 we have min = 0, so for cpm < 0.05 we have bucketCpm < 5.
 *
 * TODO: remove this function and it's usage when we switch to more dense price buckets or
 * 		 modify it to allow for example CPMs below 0.01 to fall into 0.01 bucket
 */
export function roundBucketCpm(bucketCpm: number): number {
	if (bucketCpm === 0) {
		return 0.0;
	} else if (bucketCpm < 5) {
		return 1;
	}
	return Math.floor(bucketCpm);
}

function parseWinningBid(winningBid: string): string {
	return winningBid ? parseFloat(winningBid).toFixed(2) : '';
}

export async function getPrebidBestPrice(slotName: string): Promise<Dictionary<string>> {
	const bestPrices: Dictionary<string> = {};
	const prebidAdapters = adaptersRegistry.getAdapters();

	for (const adapter of Array.from(prebidAdapters.entries())) {
		const winningBid = await getWinningBid(slotName, adapter[1].bidderName);
		const { hb_pb } = winningBid;

		bestPrices[adapter[1].bidderName] = parseWinningBid(hb_pb);
	}

	return bestPrices;
}
