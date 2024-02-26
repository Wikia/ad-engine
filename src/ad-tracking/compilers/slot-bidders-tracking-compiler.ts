import { Dictionary, SlotPriceProvider } from '@ad-engine/core';
import { CompilerPartial } from '../base-tracker';

async function getBiddersPrices(
	slotName: string,
	bidders: SlotPriceProvider,
): Promise<Dictionary<string>> {
	const realSlotPrices: Dictionary<string> = bidders.getDfpSlotPrices(slotName);
	const currentSlotPrices: Dictionary<string> = await bidders.getCurrentSlotPrices(slotName);

	function transformBidderPrice(bidderName: string): string {
		if (realSlotPrices && realSlotPrices[bidderName]) {
			return realSlotPrices[bidderName];
		}

		if (currentSlotPrices && currentSlotPrices[bidderName]) {
			return `${currentSlotPrices[bidderName]}not_used`;
		}

		return '';
	}

	return {
		bidder_0: transformBidderPrice('wikia'),
		bidder_1: transformBidderPrice('indexExchange'),
		bidder_2: transformBidderPrice('appnexus'),
		bidder_4: transformBidderPrice('rubicon'),
		bidder_8: transformBidderPrice('wikiaVideo'),
		bidder_10: transformBidderPrice('appnexusAst'),
		bidder_11: transformBidderPrice('rubicon_display'),
		bidder_12: transformBidderPrice('a9'),
		bidder_14: transformBidderPrice('pubmatic'),
		bidder_17: transformBidderPrice('kargo'),
		bidder_19: transformBidderPrice('gumgum'),
		bidder_21: transformBidderPrice('triplelift'),
		bidder_25: transformBidderPrice('nobid'),
		bidder_37: transformBidderPrice('webAds'),
	};
}

export const slotBiddersTrackingCompiler = async (
	{ data, slot }: CompilerPartial,
	bidders,
): Promise<CompilerPartial> => {
	if (!bidders) {
		return { slot, data };
	}

	return {
		slot,
		data: {
			...data,
			bidder_won: slot.winningBidderDetails ? slot.winningBidderDetails.name : '',
			bidder_won_price: slot.winningBidderDetails ? slot.winningBidderDetails.price : '',
			...(await getBiddersPrices(slot.getSlotName(), bidders)),
		},
	};
};
