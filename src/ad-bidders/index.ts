import { context, Dictionary, events, eventService, utils } from '@ad-engine/core';
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

function applyTargetingParams(slotName, targeting): void {
	Object.keys(targeting).forEach((key) =>
		context.set(`slots.${slotName}.targeting.${key}`, targeting[key]),
	);
}

function getAllBidders(): (A9 | Prebid)[] {
	return Object.values(biddersRegistry);
}

async function getBidParameters(slotName): Promise<Dictionary> {
	const slotParams = {};

	await Promise.all(
		getAllBidders().map(async (bidder) => {
			if (bidder && bidder.wasCalled()) {
				const params = await bidder.getSlotTargetingParams(slotName);

				Object.assign(slotParams, params);
			}
		}),
	);

	return slotParams;
}

async function getCurrentSlotPrices(slotName): Promise<Dictionary<string>> {
	const slotPrices = {};

	await Promise.all(
		getAllBidders().map(async (bidder) => {
			if (bidder && bidder.isSlotSupported(slotName)) {
				const priceFromBidder = await bidder.getSlotBestPrice(slotName);

				Object.keys(priceFromBidder).forEach((bidderName) => {
					slotPrices[bidderName] = priceFromBidder[bidderName];
				});
			}
		}),
	);

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
function hasAllResponses(): boolean {
	const missingBidders = Object.keys(biddersRegistry).filter((bidderName) => {
		const bidder = biddersRegistry[bidderName];

		return !bidder.hasResponse();
	});

	return missingBidders.length === 0;
}

function resetTargetingKeys(slotName): void {
	getAllBidders().forEach((bidder) => {
		bidder.getTargetingKeys(slotName).forEach((key) => {
			context.remove(`slots.${slotName}.targeting.${key}`);
		});
	});

	utils.logger(logGroup, 'resetTargetingKeys', slotName);
}

function requestBids({ responseListener = null }): void {
	const config = context.get('bidders') || {};

	if (config.prebid && config.prebid.enabled) {
		biddersRegistry.prebid = new Prebid(config.prebid, config.timeout);
	}

	if (config.a9 && config.a9.enabled) {
		biddersRegistry.a9 = new A9(config.a9, config.timeout);
	}

	getAllBidders().forEach((bidder) => {
		if (responseListener) {
			bidder.addResponseListener(responseListener);
		}

		bidder.call();
	});
}

/**
 * Executes callback function if bidding is finished or timeout is reached
 */
function runOnBiddingReady(callback: () => void): Promise<void> {
	const responses = [];

	getAllBidders().forEach((bidder) => {
		responses.push(bidder.waitForResponse());
	});

	return Promise.all(responses).then(callback);
}

async function storeRealSlotPrices(slotName): Promise<void> {
	realSlotPrices[slotName] = await getCurrentSlotPrices(slotName);
}

async function updateSlotTargeting(slotName): Promise<Dictionary> {
	const bidderTargeting = await getBidParameters(slotName);

	await storeRealSlotPrices(slotName);

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
