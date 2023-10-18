import { AdSlotEvent, slotService, slotTweaker, targetingService, utils } from '@ad-engine/core';

const logGroup = 'Anyclip';

export class AnyclipBidsRefresher {
	constructor(private subscribeFuncName: string) {}

	public trySubscribingBidRefreshing() {
		const subscribe = window[this.subscribeFuncName];

		if (typeof subscribe === 'function') {
			subscribe(() => this.onAdImpressionHandler(), 'adImpression');
		} else {
			utils.logger(
				logGroup,
				'No Anyclip subscribe function available (lreSubscribe does not exist?)...',
			);
		}
	}

	private onAdImpressionHandler() {
		utils.logger(logGroup, 'AnyclipBidsRefresher: ad impression in Anyclip detected - refreshing');

		const slotName = 'incontent_player';
		const playerAdSlot = slotService.get(slotName);

		playerAdSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION); // removes video bids
		playerAdSlot.emit(AdSlotEvent.VIDEO_AD_USED); // refreshes bidders targeting
		slotTweaker.setDataParam(playerAdSlot, 'gptSlotParams', targetingService.dump(slotName));
	}
}
