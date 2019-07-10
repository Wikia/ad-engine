import { context, Dictionary, events, eventService, utils } from '@wikia/ad-engine';
import { A9 } from './a9';
import { Prebid } from './prebid';
import * as prebidHelper from './prebid/prebid-helper';
import { transformPriceFromBid } from './prebid/price-helper';

interface BiddersRegistry {
	a9?: A9;
	prebid?: Prebid;
}

const biddersRegistry: BiddersRegistry = {};
const realSlotPrices = {};
const logGroup = 'bidders';

eventService.on(events.VIDEO_AD_REQUESTED, (adSlot) => {
	adSlot.updateWinningPbBidderDetails();
});

eventService.on(events.VIDEO_AD_USED, (adSlot) => {
	updateSlotTargeting(adSlot.getSlotName());
});

function applyTargetingParams(slotName, targeting) {
	Object.keys(targeting).forEach((key) =>
		context.set(`slots.${slotName}.targeting.${key}`, targeting[key]),
	);
}

/**
 * Executes callback function on each enabled bidder
 *
 * @param {function} callback
 */
function forEachBidder(callback) {
	Object.keys(biddersRegistry).forEach((bidderName) => {
		callback(biddersRegistry[bidderName]);
	});
}

function getBidParameters(slotName) {
	const slotParams = {};

	forEachBidder((bidder) => {
		if (bidder && bidder.wasCalled()) {
			const params = bidder.getSlotTargetingParams(slotName);

			Object.assign(slotParams, params);
		}
	});

	return slotParams;
}

function getCurrentSlotPrices(slotName): Dictionary<string> {
	const slotPrices = {};

	forEachBidder((bidder) => {
		if (bidder && bidder.isSlotSupported(slotName)) {
			const priceFromBidder = bidder.getSlotBestPrice(slotName);

			Object.keys(priceFromBidder).forEach((bidderName) => {
				slotPrices[bidderName] = priceFromBidder[bidderName];
			});
		}
	});

	return slotPrices;
}

function getDfpSlotPrices(slotName): Dictionary<string> {
	return realSlotPrices[slotName] || {};
}

/**
 * Returns true if all bidders replied
 *
 * @returns {boolean}
 */
function hasAllResponses() {
	const missingBidders = Object.keys(biddersRegistry).filter((bidderName) => {
		const bidder = biddersRegistry[bidderName];

		return !bidder.hasResponse();
	});

	return missingBidders.length === 0;
}

function resetTargetingKeys(slotName) {
	forEachBidder((bidder) => {
		bidder.getTargetingKeys(slotName).forEach((key) => {
			context.remove(`slots.${slotName}.targeting.${key}`);
		});
	});

	utils.logger(logGroup, 'resetTargetingKeys', slotName);
}

function requestBids({ responseListener = null }) {
	const config = context.get('bidders') || {};

	if (config.prebid && config.prebid.enabled) {
		biddersRegistry.prebid = new Prebid(config.prebid, config.timeout);
	}

	if (config.a9 && config.a9.enabled) {
		biddersRegistry.a9 = new A9(config.a9, config.timeout);
	}

	forEachBidder((bidder) => {
		if (responseListener) {
			bidder.addResponseListener(responseListener);
		}

		bidder.call();
	});
}

/**
 * Executes callback function if bidding is finished or timeout is reached
 *
 * @param {function} callback
 *
 * @returns {Promise}
 */
function runOnBiddingReady(callback) {
	const responses = [];

	forEachBidder((bidder) => {
		responses.push(bidder.waitForResponse());
	});

	return Promise.all(responses).then(callback);
}

function storeRealSlotPrices(slotName) {
	realSlotPrices[slotName] = getCurrentSlotPrices(slotName);
}

function updateSlotTargeting(slotName) {
	const bidderTargeting = getBidParameters(slotName);

	storeRealSlotPrices(slotName);

	resetTargetingKeys(slotName);
	applyTargetingParams(slotName, bidderTargeting);

	utils.logger(logGroup, 'updateSlotTargeting', slotName, bidderTargeting);

	return bidderTargeting;
}

export const bidders = {
	getBidParameters,
	getCurrentSlotPrices,
	getDfpSlotPrices,
	hasAllResponses,
	prebidHelper,
	requestBids,
	runOnBiddingReady,
	transformPriceFromBid,
	updateSlotTargeting,
};

export * from './tracking';
export * from './wrappers';
