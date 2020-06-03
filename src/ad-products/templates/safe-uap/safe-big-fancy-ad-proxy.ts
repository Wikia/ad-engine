import { AdSlot, context, templateService, utils } from '@ad-engine/core';
import { universalAdPackage } from '../uap';
import { FanTakeoverCampaignConfig } from './safe-fan-takeover-config-loader';

const BASE_ASSETS_URL = '//static.nocookie.net/fandom-ae-assets/programmatic/latest';

export class SafeBigFancyAdProxy {
	private adContainer: HTMLElement;
	private defaultBackground: HTMLElement;
	private resolvedBackground: HTMLElement;
	private thumbnail: HTMLElement;

	constructor(private adSlot: AdSlot, private config: FanTakeoverCampaignConfig) {}

	loadTemplate(): void {
		this.createNewAdSlotIframe();
		this.initTemplate();
	}

	private createNewAdSlotIframe(): void {
		const divContainer = document.createElement('div');
		const iframeBuilder = new utils.IframeBuilder();

		divContainer.classList.add('iframe-container');
		this.adSlot.getElement().appendChild(divContainer);

		const iframe: HTMLIFrameElement = iframeBuilder.create(divContainer, this.getIframeContent());

		this.setupElements(iframe.contentWindow.document);
		this.adSlot.overrideIframe(iframe);
	}

	private getIframeContent(): string {
		const deviceType = context.get('state.isMobile') ? 'mobile' : 'desktop';
		const images = this.config[deviceType].images;

		return `
			<link href="${BASE_ASSETS_URL}/fan-takeover.css" rel="stylesheet" />
			<div id="adContainer">
				<div id="defaultBackground" class="hidden-state" style="background-image: url('${images.default}')"></div>
				<div id="resolvedBackground" class="hidden-state" style="background-image: url('${images.resolved}')"></div>
			</div>
			<div id="videoContainer" class="video-element">
				<img id="videoThumbnail" src="${this.config.thumbnail}" />
			</div>
		`;
	}

	private setupElements(iframeDocument: Document): void {
		this.adContainer = iframeDocument.getElementById('adContainer');
		this.defaultBackground = iframeDocument.getElementById('defaultBackground');
		this.resolvedBackground = iframeDocument.getElementById('resolvedBackground');

		[this.defaultBackground, this.resolvedBackground].forEach((element) => {
			element.addEventListener('click', () => top.open(this.config.clickThroughUrl, '_blank'));
		});

		const thumbnailContainer = iframeDocument.getElementById('videoContainer');
		if (this.config.thumbnail) {
			this.thumbnail = thumbnailContainer;
		} else {
			thumbnailContainer.classList.add('hide');
		}
	}

	private initTemplate(): void {
		const deviceType = context.get('state.isMobile') ? 'mobile' : 'desktop';
		const state = this.getStateSetup(deviceType);
		const platformConfig = this.config[deviceType];
		const templateName = universalAdPackage.isFanTakeoverLoaded() ? 'bfab' : 'bfaa';

		templateService.init(templateName, this.adSlot, {
			type: templateName,
			adProduct: 'vuap',
			player: 'porvata',

			isMobile: context.get('state.isMobile'),
			config: {
				aspectRatio: platformConfig.aspectRatio,
				background: {
					default: platformConfig.images.default,
					resolved: platformConfig.images.resolved,
				},
				video: {
					thumb: this.config.thumbnail,
				},
				state,
			},

			slotName: this.adSlot.getSlotName(),
			uap: '5381590794', // FIXME
			lineItemId: '5381590794', // FIXME
			creativeId: 'foo', // FIXME

			isSticky: true,
			backgroundColor: '#000',
			autoPlay: true,
			resolvedStateAutoPlay: true,
			videoPlaceholderElement: this.thumbnail,

			image1: {
				element: this.defaultBackground,
				background: platformConfig.images.default,
			},
			image2: {
				element: this.resolvedBackground,
				background: platformConfig.images.resolved,
			},
			adContainer: this.adContainer,
			thumbnail: this.thumbnail,

			// vastUrl: config.vast,  // FIXME

			aspectRatio: platformConfig.aspectRatio.default,
			resolvedStateAspectRatio: platformConfig.aspectRatio.resolved,
			videoAspectRatio: 16 / 9,
			theme: 'hivi',
			isDarkTheme: false,
			blockOutOfViewportPausing: true,
			clickThroughURL: this.config.clickThroughUrl,
			fullscreenable: true,
		});
	}

	private getStateSetup(deviceType: string) {
		switch (deviceType) {
			case 'desktop':
				return {
					height: {
						default: 92,
						resolved: 100,
					},
					width: {
						default: 40.9,
						resolved: 17.8,
					},
					top: {
						default: 4,
						resolved: 0,
					},
				};
			case 'mobile':
				return {
					height: {
						default: 100,
						resolved: 65,
					},
					width: {
						default: 100,
						resolved: 38.4,
					},
					right: {
						default: 0,
						resolved: 2.5,
					},
					bottom: {
						default: 0,
						resolved: 7,
					},
				};
		}
	}
}
