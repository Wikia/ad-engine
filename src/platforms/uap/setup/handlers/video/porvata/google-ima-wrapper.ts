import { PorvataSettings } from './porvata-settings';
import { communicationServiceSlim } from "../../../../utils/communication-service-slim";
import { AdSlotEvent } from "../../../../../../core/models/ad-slot-event";
import { context } from "../../../../../../core/services/context-service";
import { buildVastUrl } from "../utils/vast-url-builder";

export class GoogleImaWrapper {
	private static activeContainers = [];

	static createDisplayContainer(
		videoContainer: HTMLElement,
		slotName: string | null,
		slotUid: string | null,
	): google.ima.AdDisplayContainer {
		const adDisplayContainer = new window.google.ima.AdDisplayContainer(videoContainer);
		const iframe = videoContainer.querySelector<HTMLIFrameElement>('div > iframe');

		if (slotName && slotUid) {
			communicationServiceSlim.onSlotEvent(
				AdSlotEvent.DESTROY_EVENT,
				() => {
					if (!GoogleImaWrapper.activeContainers.includes(slotUid)) {
						return;
					}

					adDisplayContainer.destroy();
					GoogleImaWrapper.activeContainers = GoogleImaWrapper.activeContainers.filter(
						(el) => el !== slotUid,
					);
				},
				slotName,
				true,
			);

			GoogleImaWrapper.activeContainers.push(slotUid);
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
