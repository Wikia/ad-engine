import { getAdapters } from './adapters-registry';
import { Prebid } from './index';

const DEFAULT_MAX_CPM = 20;
const videoBiddersCap50 = ['appnexusAst', 'rubicon', 'wikiaVideo']; // bidders with $50 cap

function isValidPrice(bid) {
	return bid.getStatusCode && bid.getStatusCode() === Prebid.validResponseStatusCode;
}

export function transformPriceFromCpm(cpm, maxCpm = DEFAULT_MAX_CPM) {
	maxCpm = Math.max(maxCpm, DEFAULT_MAX_CPM);

	let result = Math.floor(maxCpm).toFixed(2);

	if (cpm === 0) {
		result = '0.00';
	} else if (cpm < 0.05) {
		result = '0.01';
	} else if (cpm < 5.0) {
		result = (Math.floor(cpm * 20) / 20).toFixed(2);
	} else if (cpm < 10.0) {
		result = (Math.floor(cpm * 10) / 10).toFixed(2);
	} else if (cpm < 20.0) {
		result = (Math.floor(cpm * 2) / 2).toFixed(2);
	} else if (cpm < maxCpm) {
		result = Math.floor(cpm).toFixed(2);
	}

	return result;
}

export function getPrebidBestPrice(slotName) {
	const bestPrices = {};

	if (window.pbjs && window.pbjs.getBidResponsesForAdUnitCode) {
		const slotBids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

		getAdapters().forEach((adapter) => {
			bestPrices[adapter.bidderName] = '';
		});

		slotBids.forEach((bid) => {
			if (isValidPrice(bid) && bid.status !== 'rendered') {
				const { bidderCode, cpm } = bid;
				const cpmPrice = transformPriceFromCpm(cpm);

				bestPrices[bidderCode] = Math.max(bestPrices[bidderCode] || 0, parseFloat(cpmPrice))
					.toFixed(2)
					.toString();
			}
		});
	}

	return bestPrices;
}

export function transformPriceFromBid(bid) {
	let maxCpm = DEFAULT_MAX_CPM;

	if (videoBiddersCap50.includes(bid.bidderCode)) {
		maxCpm = 50;
	}

	return transformPriceFromCpm(bid.cpm, maxCpm);
}
