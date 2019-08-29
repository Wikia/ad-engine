import { context, pbjsFactory, slotService } from '@ad-engine/core';
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

export async function getAvailableBidsByAdUnitCode(
	adUnitCode: string,
): Promise<PrebidBidResponse[]> {
	const pbjs: Pbjs = await pbjsFactory.init();
	let bids = pbjs.getBidResponsesForAdUnitCode(adUnitCode).bids || [];
	bids = bids.filter((bid) => bid.status !== 'rendered');

	return bids;
}

export function getTargeting(slotName) {
	return {
		pos: [slotName],
		...(context.get('bidders.prebid.targeting') || {}),
	};
}
