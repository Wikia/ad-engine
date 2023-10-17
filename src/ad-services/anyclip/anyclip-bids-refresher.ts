import { AdSlotEvent, slotService, slotTweaker, targetingService, utils } from '@ad-engine/core';

const logGroup = 'Anyclip';

export class AnyclipBidsRefresher {
	private adsCounter = 0;

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
		this.adsCounter++;
		utils.logger(logGroup, 'Ad impression in Anyclip detected!', this.adsCounter);

		const slotName = 'incontent_player';
		const playerAdSlot = slotService.get(slotName);

		targetingService.set('rv', this.adsCounter, slotName);
		slotTweaker.setDataParam(playerAdSlot, 'gptSlotParams', targetingService.dump(slotName));

		playerAdSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION); // refreshes video bids
		playerAdSlot.emit(AdSlotEvent.VIDEO_AD_USED); // refreshes bidders targeting
	}
}
