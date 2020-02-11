import { context, Dictionary, pbjsFactory, slotService } from '@ad-engine/core';
import { isObject } from 'util';
import { adaptersRegistry } from './adapters-registry';
import { PrebidAdapterConfig } from './prebid-models';

const lazyLoadSlots = ['bottom_leaderboard'];
const uuidKey = 'hb_uuid';
const videoType = 'video';

export const validResponseStatusCode = 1;

function isUsedAsAlias(code): boolean {
	return Object.keys(context.get('slots')).some((slotName) => {
		const bidderAlias = context.get(`slots.${slotName}.bidderAlias`);

		return bidderAlias === code && slotService.getState(slotName);
	});
}

function isSlotApplicable(code, lazyLoad): boolean {
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

function isValidPrice(bid: PrebidBidResponse): boolean {
	return bid.getStatusCode && bid.getStatusCode() === validResponseStatusCode;
}

export function setupAdUnits(lazyLoad = 'off'): PrebidAdUnit[] {
	const adUnits: PrebidAdUnit[] = [];

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

export async function getBidUUID(adUnitCode: string, adId: string): Promise<string> {
	const bid = await getBidByAdId(adUnitCode, adId);

	if (bid && bid.mediaType === videoType) {
		return bid.videoCacheKey;
	}

	return 'disabled';
}

async function getBidByAdId(adUnitCode, adId): Promise<PrebidBidResponse> {
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
	bidderName: string = null,
): Promise<PrebidTargeting> {
	let slotParams: PrebidTargeting = {};
	let deals: PrebidTargeting = {};
	const priceFloor: Dictionary<string> = context.get('bidders.prebid.priceFloor');

	// We are not using pbjs.getAdserverTargetingForAdUnitCode
	// because it takes only last auction into account.
	// We need to get all available bids (including old auctions)
	// in order to keep still available, not refreshed adapters' bids...
	const bids: PrebidBidResponse[] = await getAvailableBidsByAdUnitCode(slotName);

	if (bids.length) {
		let bidParams = null;

		bids.forEach((param) => {
			if (bidderName && bidderName !== param.bidderCode) {
				// Do nothing if we filter by bidders
			} else if (
				priceFloor &&
				isObject(priceFloor) &&
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

			// ... However we need to take care of all hb_deal_* keys manually then
			deals = {
				...deals,
				...getDealsTargetingFromBid(param),
			};
		});

		if (bidParams) {
			slotParams = {
				...deals,
				...bidParams.adserverTargeting,
			};
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
