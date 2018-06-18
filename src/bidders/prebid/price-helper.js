import { Prebid } from './';
import { getAdapters } from './adapters-registry';

function isValidPrice(bid) {
	return bid.getStatusCode && bid.getStatusCode() === Prebid.validResponseStatusCode;
}

export function getPrebidBestPrice(slotName) {
	const bestPrices = {};

	if (window.pbjs && window.pbjs.getBidResponsesForAdUnitCode) {
		const slotBids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

		getAdapters().forEach((adapter) => {
			bestPrices[adapter.bidderName] = '';
		});

		slotBids.forEach((bid) => {
			if (isValidPrice(bid)) {
				const { bidderCode, cpm } = bid;
				const cpmPrice = transformPriceFromCpm(cpm);

				bestPrices[bidderCode] = Math.max(bestPrices[bidderCode] || 0, parseFloat(cpmPrice)).toFixed(2).toString();
			}
		});
	}

	return bestPrices;
}

export function transformPriceFromCpm(cpm, maxCpm = 20) {
	const defaultCpm = 20;

	if (maxCpm < defaultCpm) {
		maxCpm = defaultCpm;
	}

	let result = Math.floor(maxCpm).toFixed(2);

	if (cpm === 0) {
		result = '0.00';
	} else if (cpm < 0.05) {
		result = '0.01';
	} else if (cpm < 5.00) {
		result = (Math.floor(cpm * 20) / 20).toFixed(2);
	} else if (cpm < 10.00) {
		result = (Math.floor(cpm * 10) / 10).toFixed(2);
	} else if (cpm < 20.00) {
		result = (Math.floor(cpm * 2) / 2).toFixed(2);
	} else if (cpm < maxCpm) {
		result = Math.floor(cpm).toFixed(2);
	}

	return result;
}
