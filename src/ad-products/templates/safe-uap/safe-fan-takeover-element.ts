import { AdSlot } from '@ad-engine/core';
import { SafeBigFancyAdProxy } from './safe-big-fancy-ad-proxy';

interface SafeFanTakeoverElementConfig {
	campaign: string;
	config: FanTakeoverCampaignConfig;
	slotName: string;
}

interface BigFancyAdConfig {
	aspectRatio: {
		default: number;
		resolved: number;
	};
	images: {
		boxad300x250: string;
		boxad300x600?: string;
		default: string;
		resolved?: string;
	};
}

export interface FanTakeoverCampaignConfig {
	desktop: BigFancyAdConfig;
	mobile: BigFancyAdConfig;
	autoplay: boolean;
	clickThroughUrl: string;
	thumbnail?: string;
	vast?: string;
	campaignId: string;
}

const BIG_FANCY_AD_SIZES = ['2x2', '3x3'];

export class SafeFanTakeoverElement {
	static config: FanTakeoverCampaignConfig;

	static getName(): string {
		return 'safeFanTakeoverElement';
	}

	constructor(private adSlot: AdSlot) {}

	async init(params: SafeFanTakeoverElementConfig): Promise<void> {
		SafeFanTakeoverElement.config = params.config;

		this.adSlot.getIframe().parentElement.classList.add('hide');

		if (this.isBfaSize()) {
			this.loadBigFancyAd(params.campaign);
		} else {
			// TODO ADEN-10313: load boxad
		}
	}

	private loadBigFancyAd(campaignId: string): void {
		const bfaProxy = new SafeBigFancyAdProxy(
			this.adSlot,
			campaignId,
			SafeFanTakeoverElement.config,
		);

		bfaProxy.loadTemplate();
	}

	private isBfaSize(): boolean {
		return BIG_FANCY_AD_SIZES.includes(this.adSlot.getCreativeSize());
	}
}
