import { props } from "ts-action";
import { BiddersEventPayload, TrackingBidDefinition } from "@ad-engine/communication";

export const A9_WITHOUT_CONSENTS = {
	name: 'A9 without consents',
} as const;
export const A9_APSTAG_HEM_SENT = {
	name: 'A9 Apstag HEM sent',
} as const;
export const BIDDERS_BIDDING_DONE = {
	category: '[Prebid]',
		name: 'Bidding done',
		payload: props<BiddersEventPayload>(),
} as const;
export const BIDDERS_BIDS_CALLED = {
	category: '[Prebid]',
		name: 'Bids called',
} as const;
export const BIDDERS_BIDS_REFRESH = {
	category: '[Prebid]',
		name: 'Bids refresh',
		payload: props<{ refreshedSlotNames: string[] }>(),
} as const;
export const BIDDERS_BIDS_RESPONSE = {
	category: '[Prebid]',
		name: 'Bids response',
		payload: props<{ bidResponse: TrackingBidDefinition }>(),
} as const;
export const BIDDERS_AUCTION_DONE = {
	category: '[Prebid]',
		name: 'Auction done',
} as const;
export const BIDDERS_CALL_PER_GROUP = {
	category: '[Prebid]',
		name: 'Call per group',
		payload: props<{ group: string; callback: () => void }>(),
} as const;
