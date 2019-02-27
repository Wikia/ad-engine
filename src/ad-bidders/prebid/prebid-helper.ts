import { context, slotService } from '@wikia/ad-engine';
import { getAdapters } from './adapters-registry';

const lazyLoadSlots = ['bottom_leaderboard'];

function isSlotApplicable(code, lazyLoad) {
	const isSlotLazy = lazyLoadSlots.indexOf(code) !== -1;

	if (!slotService.getState(code)) {
		return false;
	}

	if (
		lazyLoad !== 'off' &&
		((lazyLoad === 'pre' && isSlotLazy) || (lazyLoad === 'post' && !isSlotLazy))
	) {
		return false;
	}

	return true;
}

export function setupAdUnits(adaptersConfig, lazyLoad = 'off') {
	const adUnits = [];
	const adapters = getAdapters(adaptersConfig);

	adapters.forEach((adapter) => {
		if (adapter && adapter.enabled) {
			const adapterAdUnits = adapter.prepareAdUnits();

			adapterAdUnits.forEach((adUnit) => {
				if (adUnit && isSlotApplicable(adUnit.code, lazyLoad)) {
					adUnits.push(adUnit);
				}
			});
		}
	});

	return adUnits;
}

export function getBidByAdId(adId) {
	if (!window.pbjs || typeof window.pbjs.getBidResponses !== 'function') {
		return null;
	}

	let bids = window.pbjs.getAllPrebidWinningBids().filter((bid) => adId === bid.adId);

	if (!bids.length) {
		const responses = window.pbjs.getBidResponses();

		Object.keys(responses).forEach((adUnit) => {
			const adUnitsBids = responses[adUnit].bids.filter((bid) => adId === bid.adId);

			bids = bids.concat(adUnitsBids);
		});
	}

	return bids.length ? bids[0] : null;
}

export function getAvailableBidsByAdUnitCode(adUnitCode) {
	let bids = [];

	if (window.pbjs && typeof window.pbjs.getBidResponsesForAdUnitCode === 'function') {
		bids = window.pbjs.getBidResponsesForAdUnitCode(adUnitCode).bids || [];
		bids = bids.filter((bid) => bid.status !== 'rendered');
	}

	return bids;
}

export function getPrebid() {
	return window.pbjs;
}

export function getTargeting(slotName) {
	return {
		pos: [slotName],
		...(context.get('bidders.prebid.targeting') || {}),
	};
}

export function getWinningVideoBidBySlotName(slotName, allowedBidders) {
	if (!window.pbjs || !window.pbjs.getBidResponsesForAdUnitCode) {
		return null;
	}

	const bids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

	return bids
		.filter((bid) => {
			const canUseThisBidder = !allowedBidders || allowedBidders.indexOf(bid.bidderCode) !== -1;
			const hasVast = bid.vastUrl || bid.vastContent;

			return canUseThisBidder && hasVast && bid.cpm > 0;
		})
		.reduce((previousBid, currentBid) => {
			if (previousBid === null || currentBid.cpm > previousBid.cpm) {
				return currentBid;
			}

			return previousBid;
		}, null);
}

export function pushPrebid(callback) {
	window.pbjs.que.push(callback);
}
