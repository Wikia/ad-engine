import { AdSlot } from '@ad-engine/core';
import { SafeBigFancyAdProxy } from './safe-big-fancy-ad-proxy';
import {
	FanTakeoverCampaignConfig,
	safeFanTakeoverConfigLoader,
} from './safe-fan-takeover-config-loader';

interface SafeFanTakeoverElementConfig {
	campaign: string;
	slotName: string;
}

const BIG_FANCY_AD_SIZES = ['2x2', '3x3'];

export class SafeFanTakeoverElement {
	static config: FanTakeoverCampaignConfig = null;
	static getName(): string {
		return 'safeFanTakeoverElement';
	}

	constructor(private adSlot: AdSlot) {}

	async init(params: SafeFanTakeoverElementConfig): Promise<void> {
		this.adSlot.getIframe().parentElement.classList.add('hide');

		if (SafeFanTakeoverElement.config === null) {
			SafeFanTakeoverElement.config = await safeFanTakeoverConfigLoader.loadConfig(params.campaign);
		}

		if (this.isBfaSize()) {
			this.loadBigFancyAd();
		} else {
			// TODO ADEN-10313: load boxad
		}
	}

	private loadBigFancyAd(): void {
		const bfaProxy = new SafeBigFancyAdProxy(this.adSlot, SafeFanTakeoverElement.config);

		bfaProxy.loadTemplate();
	}

	private isBfaSize(): boolean {
		return BIG_FANCY_AD_SIZES.includes(this.adSlot.getCreativeSize());
	}
}
