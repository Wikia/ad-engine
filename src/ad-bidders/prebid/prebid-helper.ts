import { context, slotService } from '@wikia/ad-engine';
import { adaptersRegistry } from './adapters-registry';

const lazyLoadSlots = ['bottom_leaderboard'];
const videoType = 'video';

function isUsedAsAlias(code) {
	return Object.keys(context.get('slots')).some((slotName) => {
		const bidderAlias = context.get(`slots.${slotName}.bidderAlias`);

		return bidderAlias === code && slotService.getState(slotName);
	});
}

function isSlotApplicable(code, lazyLoad) {
	const isSlotLazy = lazyLoadSlots.indexOf(code) !== -1;
	const isSlotLazyIgnored =
		lazyLoad !== 'off' &&
		((lazyLoad === 'pre' && isSlotLazy) || (lazyLoad === 'post' && !isSlotLazy));

	// This can be simplified once we get rid of uppercase slot names
	const isSlotDisabled = context.get(`slots.${code}`)
		? !slotService.getState(code)
		: !isUsedAsAlias(code);

	return !(isSlotDisabled || isSlotLazyIgnored);
}

export function setupAdUnits(lazyLoad = 'off') {
	const adUnits = [];

	adaptersRegistry.getAdapters().forEach((adapter) => {
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

export function getBidUUID(adUnitCode: string, adId: string): string {
	const bid = getBidByAdId(adUnitCode, adId);

	if (bid && bid.mediaType === videoType) {
		return bid.videoCacheKey;
	}

	return 'disabled';
}

export function getBidByAdId(adUnitCode, adId) {
	if (!window.pbjs || typeof window.pbjs.getBidResponsesForAdUnitCode !== 'function') {
		return null;
	}

	const { bids } = window.pbjs.getBidResponsesForAdUnitCode(adUnitCode);
	const foundBids = bids.filter((bid) => adId === bid.adId);

	return foundBids.length ? foundBids[0] : null;
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
