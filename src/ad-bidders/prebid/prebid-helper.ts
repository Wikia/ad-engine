import { context, Dictionary, pbjsFactory, slotService } from '@ad-engine/core';
import { PrebidAdapterConfig } from './prebid-models';

const uuidKey = 'hb_uuid';
const videoType = 'video';

export const validResponseStatusCode = 1;

function isUsedAsAlias(code): boolean {
	return Object.keys(context.get('slots')).some((slotName) => {
		const bidderAlias = context.get(`slots.${slotName}.bidderAlias`);

		return bidderAlias === code && slotService.getState(slotName);
	});
}

export function isSlotApplicable(code): boolean {
	// This can be simplified once we get rid of uppercase slot names
	const isApplicable = context.get(`slots.${code}`)
		? slotService.getState(code)
		: isUsedAsAlias(code);

	if (!(context.get('bidders.prebid.filter') === 'static') || code.includes('video')) {
		return isApplicable;
	}

	return document.querySelector(`div[id="${code}"]`) !== null ? isApplicable : false;
}

function isValidPrice(bid: PrebidBidResponse): boolean {
	return bid.getStatusCode && bid.getStatusCode() === validResponseStatusCode;
}

export async function getBidUUID(adUnitCode: string, adId: string): Promise<string> {
	const bid = await getBidByAdId(adUnitCode, adId);

	if (bid && bid.mediaType === videoType) {
		return bid.videoCacheKey;
	}

	return 'disabled';
}

export async function getBidByAdId(adUnitCode, adId): Promise<PrebidBidResponse> {
	const pbjs: Pbjs = await pbjsFactory.init();
	const { bids } = pbjs.getBidResponsesForAdUnitCode(adUnitCode);
	const foundBids = bids.filter((bid) => adId === bid.adId);

	return foundBids.length ? foundBids[0] : null;
}

export function getDealsTargetingFromBid(bid: Dictionary): PrebidTargeting {
	const keyValuePairs: Dictionary = {};

	Object.keys(bid.adserverTargeting).forEach((key) => {
		if (key.indexOf('hb_deal_') === 0) {
			keyValuePairs[key] = bid.adserverTargeting[key];
		}
	});

	return keyValuePairs;
}

export async function getWinningBid(
	slotName: string,
	bidderName: string,
): Promise<PrebidTargeting> {
	let slotParams: PrebidTargeting = {};
	const priceFloor: Dictionary<string> = context.get('bidders.prebid.priceFloor');

	// We are not using pbjs.getAdserverTargetingForAdUnitCode
	// because it takes only last auction into account.
	// We need to get all available bids (including old auctions)
	// in order to keep still available, not refreshed adapters' bids...
	const bids: PrebidBidResponse[] = await getAvailableBidsByAdUnitCode(slotName);

	if (bids.length) {
		let bidParams = null;

		bids.forEach((param) => {
			if (bidderName !== param.bidderCode) {
				// Do nothing if we filter by bidders
			} else if (
				priceFloor &&
				typeof priceFloor === 'object' &&
				priceFloor[`${param.width}x${param.height}`] &&
				param.cpm < parseFloat(priceFloor[`${param.width}x${param.height}`])
			) {
				// Do nothing if bid not meets floor rule
			} else if (!bidParams) {
				bidParams = param;
			} else if (bidParams.cpm === param.cpm) {
				bidParams = bidParams.timeToRespond > param.timeToRespond ? param : bidParams;
			} else {
				bidParams = bidParams.cpm < param.cpm ? param : bidParams;
			}
		});

		if (bidParams) {
			slotParams = bidParams.adserverTargeting;
		}
	}

	const { hb_adid: adId } = slotParams;

	if (adId) {
		const uuid: string = await getBidUUID(slotName, adId);

		if (uuid) {
			// This is not calculated in prebid-settings for hb_uuid
			// because AppNexus adapter is using external service to retrieve
			// cache key and adserverTargeting is executed too early.
			// We have to take it as late as possible.
			slotParams[uuidKey] = uuid;
		}
	}

	return slotParams || {};
}

export async function getAvailableBidsByAdUnitCode(
	adUnitCode: string,
): Promise<PrebidBidResponse[]> {
	const pbjs: Pbjs = await pbjsFactory.init();
	const bids = pbjs.getBidResponsesForAdUnitCode(adUnitCode).bids || [];

	return bids.filter((bid) => isValidPrice(bid) && bid.status !== 'rendered');
}

export function isPrebidAdapterConfig(
	config: PrebidAdapterConfig | any,
): config is PrebidAdapterConfig {
	if (!(typeof config === 'object')) {
		return false;
	}

	const hasEnabledField = typeof config.enabled === 'boolean';
	const hasSlotsDictionary = typeof config.slots === 'object';

	return hasEnabledField && hasSlotsDictionary;
}
