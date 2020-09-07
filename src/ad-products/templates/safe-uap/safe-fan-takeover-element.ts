import { AdSlot, events, eventService, utils } from '@ad-engine/core';
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

interface Size {
	height: number;
	width: number;
}

const BIG_FANCY_AD_SIZES = ['2x2', '3x3'];

export class SafeFanTakeoverElement {
	static config: FanTakeoverCampaignConfig;

	static getName(): string {
		return 'safeFanTakeoverElement';
	}

	constructor(private adSlot: AdSlot) {}

	async init(params: SafeFanTakeoverElementConfig): Promise<void> {
		this.adSlot.getIframe().parentElement.classList.add('hide');

		if (!SafeFanTakeoverElement.config) {
			SafeFanTakeoverElement.config = params.config;
			eventService.once(events.BEFORE_PAGE_CHANGE_EVENT, () => {
				SafeFanTakeoverElement.config = null;
			});
		}

		if (this.isBfaSize()) {
			this.loadBigFancyAd(params.campaign);
		} else {
			this.loadBoxad();
		}
	}
	private isBfaSize(): boolean {
		return BIG_FANCY_AD_SIZES.includes(this.adSlot.getCreativeSize());
	}

	private loadBigFancyAd(campaignId: string): void {
		const bfaProxy = new SafeBigFancyAdProxy(
			this.adSlot,
			campaignId,
			SafeFanTakeoverElement.config,
		);

		bfaProxy.loadTemplate();
	}

	private loadBoxad(): void {
		const divContainer = document.createElement('div');
		const iframeBuilder = new utils.IframeBuilder();
		const imageUrl = this.getBoxadImageUrl();
		const { height, width } = this.getBoxadSize();

		divContainer.classList.add('iframe-container');
		this.adSlot.getElement().appendChild(divContainer);

		const html = `
		<a href="${SafeFanTakeoverElement.config.clickThroughUrl}" target="_blank">
			<img src="${imageUrl}">
		</a>`;

		const iframe: HTMLIFrameElement = iframeBuilder.create(divContainer, html);

		divContainer.style.height = `${height}px`;
		divContainer.style.width = `${width}px`;
		divContainer.style.margin = 'auto';
		iframe.style.height = '100%';
		iframe.style.width = '100%';

		this.adSlot.overrideIframe(iframe);
	}

	private getBoxadImageUrl(): string {
		const { height, width } = this.getBoxadSize();

		return SafeFanTakeoverElement.config.desktop.images[`boxad${width}x${height}`];
	}

	private getBoxadSize(): Size {
		return this.adSlot.getCreativeSize() === '300x600' ||
			this.adSlot.getCreativeSize() === '300x601'
			? { height: 600, width: 300 }
			: { height: 250, width: 300 };
	}
}
