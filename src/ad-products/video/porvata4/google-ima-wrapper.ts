import { AdSlot, buildVastUrl, context } from '@ad-engine/core';
import { PorvataSettings } from './porvata-settings';

export class GoogleImaWrapper {
	static createDisplayContainer(
		videoContainer: HTMLElement,
		slot: AdSlot = null,
	): google.ima.AdDisplayContainer {
		const adDisplayContainer = new window.google.ima.AdDisplayContainer(videoContainer);
		const iframe = videoContainer.querySelector<HTMLIFrameElement>('div > iframe');

		if (slot) {
			slot.on(AdSlot.DESTROYED_EVENT, () => {
				adDisplayContainer.destroy();
			});
		}

		GoogleImaWrapper.reloadIframeOnNavigation(iframe);

		return adDisplayContainer;
	}

	private static reloadIframeOnNavigation(iframe: HTMLIFrameElement): void {
		// Reload iframe in order to make IMA work when user is moving back/forward to the page with
		// player
		// https://groups.google.com/forum/#!topic/ima-sdk/Q6Y56CcXkpk
		// https://github.com/googleads/videojs-ima/issues/110
		if (
			window.performance &&
			window.performance.navigation &&
			window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD
		) {
			iframe.contentWindow.location.href = iframe.src;
		}
	}

	static createAdsLoader(adDisplayContainer, videoSettings: PorvataSettings): google.ima.AdsLoader {
		const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

		adsLoader.getSettings().setVpaidMode(videoSettings.getVpaidMode());

		return adsLoader;
	}

	static createAdsRequest(settings: PorvataSettings): google.ima.AdsRequest {
		const adsRequest = new window.google.ima.AdsRequest();
		const width = settings.getWidth();
		const height = settings.getHeight();

		adsRequest.adTagUrl =
			settings.getVastUrl() ||
			buildVastUrl(width / height, settings.getSlotName(), {
				targeting: settings.getVastTargeting(),
			});
		adsRequest.linearAdSlotWidth = width;
		adsRequest.linearAdSlotHeight = height;

		adsRequest.setAdWillAutoPlay(settings.isAutoPlay());
		adsRequest.setAdWillPlayMuted(settings.isAutoPlay());

		return adsRequest;
	}

	static getRenderingSettings(): google.ima.AdsRenderingSettings {
		const adsRenderingSettings = new window.google.ima.AdsRenderingSettings();
		const maximumRecommendedBitrate = 68000; // 2160p High Frame Rate

		if (!context.get('state.isMobile')) {
			adsRenderingSettings.bitrate = maximumRecommendedBitrate;
		}

		adsRenderingSettings.loadVideoTimeout = 15000;
		adsRenderingSettings.enablePreloading = true;
		adsRenderingSettings.uiElements = [];

		return adsRenderingSettings;
	}
}
