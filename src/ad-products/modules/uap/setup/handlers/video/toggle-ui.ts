// @ts-strict-ignore
import { client } from "../../../../../../core/utils";
import { communicationServiceSlim } from "../../../utils/communication-service-slim";
import { AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED } from "../../../../../../communication/events/events-ad-engine-video";

const FADE_OUT_TIMEOUT = 3000;
const FADE_OUT_ANIMATION_TIME = 1000;

export class ToggleUI {
	static add(video, container, params): void {
		let removeVisibilityTimeout: number;
		let fadeOutTimeout: number;

		const isMobile = client.isSmartphone() || client.isTablet();
		const overlay = document.createElement('div');
		const panel = container.querySelector('.dynamic-panel');

		function fadeOut(): void {
			fadeOutTimeout = window.setTimeout(() => {
				overlay.classList.add('fading');
				panel.classList.add('fading');
			}, FADE_OUT_TIMEOUT);

			removeVisibilityTimeout = window.setTimeout(() => {
				container.classList.remove('ui-visible');
			}, FADE_OUT_TIMEOUT + FADE_OUT_ANIMATION_TIME);
		}

		function resetFadeOut(): void {
			clearTimeout(removeVisibilityTimeout);
			clearTimeout(fadeOutTimeout);

			overlay.classList.remove('fading');
			panel.classList.remove('fading');
		}

		overlay.classList.add('toggle-ui-overlay');
		video.addEventListener('start', () => {
			container.classList.add('ui-visible');
			resetFadeOut();
			fadeOut();
		});

		if (isMobile) {
			overlay.addEventListener('click', () => {
				container.classList.toggle('ui-visible');
				resetFadeOut();

				if (video.isPlaying()) {
					fadeOut();
				}
			});

			video.addEventListener('resume', fadeOut);
			video.addEventListener('pause', resetFadeOut);
		} else {
			container.addEventListener('mouseenter', () => {
				container.classList.add('ui-visible');
				resetFadeOut();
			});

			container.addEventListener('mouseleave', () => {
				fadeOut();
			});

			overlay.addEventListener('click', () => {
				top.open(params.clickThroughURL, '_blank');
				communicationServiceSlim.emit(AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED, {
					adSlotName: video.settings.getSlotName(),
					ad_status: 'video-click',
				});
			});
		}

		container.appendChild(overlay);
	}
}
