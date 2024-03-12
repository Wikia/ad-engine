import {
	AdSlotEvent,
	slotService,
	slotTweaker,
	targetingService,
	type AdSlot,
} from '@ad-engine/core';
import { logger } from '@ad-engine/utils';

const logGroup = 'Anyclip';

export class AnyclipBidsRefresher {
	constructor(private subscribeFuncName: string) {}

	public trySubscribingBidRefreshing() {
		const subscribe = window[this.subscribeFuncName];

		if (typeof subscribe === 'function') {
			subscribe(() => this.onAdImpressionHandler(), 'adImpression');
		} else {
			logger(logGroup, 'No Anyclip subscribe function available (lreSubscribe does not exist?)...');
		}
	}

	private onAdImpressionHandler() {
		logger(logGroup, 'AnyclipBidsRefresher: ad impression in Anyclip detected - refreshing');

		const slotName = 'incontent_player';
		const playerAdSlot = slotService.get(slotName);

		this.sendSignalToRemoveBids(playerAdSlot);
		slotTweaker.setDataParam(playerAdSlot, 'gptSlotParams', targetingService.dump(slotName));
	}

	private sendSignalToRemoveBids(playerAdSlot: AdSlot) {
		playerAdSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION);
	}
}
