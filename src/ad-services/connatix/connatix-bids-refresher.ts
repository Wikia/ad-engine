import {
	AdSlot,
	AdSlotEvent,
	slotService,
	slotTweaker,
	targetingService,
	utils,
} from '@ad-engine/core';
import { ConnatixPlayerApi } from './connatix-player';

const logGroup = 'connatix';

export class ConnatixBidsRefresher {
	constructor(private playerApi: ConnatixPlayerApi) {}

	public registerBidRefreshing() {
		if (typeof this.playerApi === 'object') {
			this.playerApi.on('adImpression', () => this.onAdImpressionHandler());
		} else {
			utils.logger(logGroup, 'No Connatix player API available...');
		}
	}

	private onAdImpressionHandler() {
		utils.logger(
			logGroup,
			'ConnatixBidsRefresher: ad impression in Connatix detected - refreshing',
		);

		const slotName = 'incontent_player';
		const playerAdSlot = slotService.get(slotName);

		this.sendSignalToRemoveBids(playerAdSlot);
		slotTweaker.setDataParam(playerAdSlot, 'gptSlotParams', targetingService.dump(slotName));
	}

	private sendSignalToRemoveBids(playerAdSlot: AdSlot) {
		playerAdSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION);
	}
}
