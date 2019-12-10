import { context, Dictionary, events, eventService, trackingOptIn, utils } from '@ad-engine/core';
import { A9Provider } from './a9';
import { PrebidProvider } from './prebid';
import * as prebidHelper from './prebid/prebid-helper';
import { transformPriceFromBid } from './prebid/price-helper';

interface BiddersProviders {
	a9?: A9Provider;
	prebid?: PrebidProvider;
}

const biddersProviders: BiddersProviders = {};
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

function getBiddersProviders(): (A9Provider | PrebidProvider)[] {
	return Object.values(biddersProviders);
}

async function getBidParameters(slotName): Promise<Dictionary> {
	const slotParams = {};

	await Promise.all(
		getBiddersProviders().map(async (provider) => {
			if (provider && provider.wasCalled()) {
				const params = await provider.getSlotTargetingParams(slotName);

				Object.assign(slotParams, params);
			}
		}),
	);

	return slotParams;
}

async function getCurrentSlotPrices(slotName): Promise<Dictionary<string>> {
	const slotPrices = {};

	await Promise.all(
		getBiddersProviders().map(async (provider) => {
			if (provider && provider.isSlotSupported(slotName)) {
				const priceFromBidder = await provider.getSlotBestPrice(slotName);

				Object.keys(priceFromBidder).forEach((adapterName) => {
					slotPrices[adapterName] = priceFromBidder[adapterName];
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
	const missingProviders = Object.keys(biddersProviders).filter((providerName) => {
		const provider = biddersProviders[providerName];

		return !provider.hasResponse();
	});

	return missingProviders.length === 0;
}

function resetTargetingKeys(slotName): void {
	getBiddersProviders().forEach((provider) => {
		provider.getTargetingKeys(slotName).forEach((key) => {
			context.remove(`slots.${slotName}.targeting.${key}`);
		});
	});

	utils.logger(logGroup, 'resetTargetingKeys', slotName);
}

function requestBids({ responseListener = null }): void {
	const config = context.get('bidders') || {};

	if (config.prebid && config.prebid.enabled) {
		biddersProviders.prebid = new PrebidProvider(config.prebid, config.timeout);
	}

	if (config.a9 && config.a9.enabled && !trackingOptIn.isOptOutSale()) {
		biddersProviders.a9 = new A9Provider(config.a9, config.timeout);
	}

	getBiddersProviders().forEach((provider) => {
		if (responseListener) {
			provider.addResponseListener(responseListener);
		}

		provider.call();
	});
}

/**
 * Executes callback function if bidding is finished or timeout is reached
 */
function runOnBiddingReady(callback: () => void): Promise<void> {
	const responses = [];

	getBiddersProviders().forEach((provider) => {
		responses.push(provider.waitForResponse());
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
