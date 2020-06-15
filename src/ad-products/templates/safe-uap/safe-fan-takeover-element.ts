import { AdSlot, events, eventService, utils } from '@ad-engine/core';
import { SafeBigFancyAdProxy } from './safe-big-fancy-ad-proxy';
import {
	FanTakeoverCampaignConfig,
	SafeFanTakeoverConfigLoader,
} from './safe-fan-takeover-config-loader';

interface SafeFanTakeoverElementConfig {
	campaign: string;
	slotName: string;
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

	private safeFanTakeoverConfigLoader = new SafeFanTakeoverConfigLoader();

	constructor(private adSlot: AdSlot) {}

	async init(params: SafeFanTakeoverElementConfig): Promise<void> {
		this.adSlot.getIframe().parentElement.classList.add('hide');

		if (!SafeFanTakeoverElement.config) {
			SafeFanTakeoverElement.config = await this.safeFanTakeoverConfigLoader.loadConfig(
				params.campaign,
			);
			eventService.once(events.BEFORE_PAGE_CHANGE_EVENT, () => {
				SafeFanTakeoverElement.config = null;
			});
		}

		if (this.isBfaSize()) {
			this.loadBigFancyAd();
		} else {
			this.loadBoxad();
		}
	}

	private isBfaSize(): boolean {
		return BIG_FANCY_AD_SIZES.includes(this.adSlot.getCreativeSize());
	}

	private loadBigFancyAd(): void {
		const bfaProxy = new SafeBigFancyAdProxy(this.adSlot, SafeFanTakeoverElement.config);

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
		return this.adSlot.getCreativeSize() === '300x600'
			? SafeFanTakeoverElement.config.desktop.images.boxad300x600
			: SafeFanTakeoverElement.config.desktop.images.boxad300x250;
	}

	private getBoxadSize(): Size {
		return this.adSlot.getCreativeSize() === '300x600'
			? { height: 600, width: 300 }
			: { height: 250, width: 300 };
	}
}
