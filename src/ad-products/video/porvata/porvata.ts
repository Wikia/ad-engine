import { AdSlot, slotService, SlotTargeting, utils } from '@ad-engine/core';
import { PorvataFactory } from './porvata-factory';
import { PorvataListener } from './porvata-listener';
import { PorvataPlayer } from './porvata-player';
import { PorvataSettings } from './porvata-settings';

export interface PorvataTemplateParams {
	adProduct: string;
	autoPlay: boolean;
	container: HTMLDivElement;
	enableInContentFloating?: boolean;
	hideWhenPlaying: HTMLElement;
	onReady?: (player: PorvataPlayer) => void;
	slotName: string;
	src: string;
	startInViewportOnly?: boolean;
	vastTargeting: SlotTargeting;
	viewportHookElement?: HTMLElement;
	viewportOffsetBottom?: number;
	viewportOffsetTop?: number;
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
}

export const VpaidMode = {
	DISABLED: 0,
	ENABLED: 1,
	INSECURE: 2,
};

/**
 * @TODO: Consider reimplementation of this class/logic. In my opinion it conflicts with PorvataFactory.
 * 		It does the same thing -- creates Porvata instance, but adds some additional logic which, I believe, could
 * 		be moved to the factory or split into some UI elements/Porvata plugins.
 */
export class Porvata {
	private static addOnViewportChangeListener(
		params: PorvataTemplateParams,
		listener: (isVisible: boolean) => void,
	): string {
		return utils.viewportObserver.addListener(
			params.viewportHookElement || params.container,
			listener,
			{
				offsetTop: params.viewportOffsetTop || 0,
				offsetBottom: params.viewportOffsetBottom || 0,
			},
		);
	}

	static createVideoContainer(parent: HTMLElement): HTMLDivElement {
		const container: HTMLElement = document.createElement('div');
		const displayWrapper: HTMLDivElement = document.createElement('div');

		container.classList.add('video-overlay');
		displayWrapper.classList.add('video-display-wrapper');

		container.appendChild(displayWrapper);
		parent.appendChild(container);

		return displayWrapper;
	}

	static inject(params: PorvataTemplateParams): Promise<PorvataPlayer> {
		const porvataListener = new PorvataListener({
			adProduct: params.adProduct,
			position: params.slotName,
			src: params.src,
			withAudio: !params.autoPlay,
			withCtp: !params.autoPlay,
		});

		let isFirstPlay = true;
		let autoPlayed = false;
		let viewportListenerId: string = null;

		function muteFirstPlay(video: PorvataPlayer): void {
			video.addEventListener('wikiaAdsManagerLoaded', () => {
				if (isFirstPlay) {
					video.mute();
				}
			});
		}

		params.vastTargeting = params.vastTargeting || {};

		const videoSettings = new PorvataSettings(params);

		porvataListener.init();

		return PorvataFactory.create(videoSettings).then((player: PorvataPlayer) => {
			function inViewportCallback(isVisible: boolean): void {
				// Play video automatically only for the first time
				if (isVisible && !autoPlayed && params.autoPlay) {
					player.dispatchEvent('wikiaFirstTimeInViewport');
					player.play();
					autoPlayed = true;
					// Don't resume when video was paused manually
				}
			}

			function setupAutoPlayMethod(): void {
				if (!params.startInViewportOnly && params.autoPlay && !autoPlayed) {
					autoPlayed = true;
					player.play();
				} else {
					viewportListenerId = Porvata.addOnViewportChangeListener(params, inViewportCallback);
				}
			}

			porvataListener.registerVideoEvents(player);

			player.addEventListener('adCanPlay', () => {
				player.dispatchEvent('wikiaAdStarted');
				slotService.get(params.slotName)?.emit(AdSlot.VIDEO_AD_IMPRESSION);
			});
			player.addEventListener('allAdsCompleted', () => {
				if (player.isFullscreen()) {
					player.toggleFullscreen();
				}

				player.setAutoPlay(false);
				player.dispatchEvent('wikiaAdCompleted');
				if (viewportListenerId) {
					utils.viewportObserver.removeListener(viewportListenerId);
					viewportListenerId = null;
				}
				isFirstPlay = false;
				porvataListener.params.withAudio = true;
				porvataListener.params.withCtp = true;
			});
			player.addEventListener('wikiaAdRestart', () => {
				isFirstPlay = false;
			});
			player.addEventListener('start', () => {
				player.dispatchEvent('wikiaAdPlay');
				if (!viewportListenerId && !autoPlayed) {
					setupAutoPlayMethod();
				}
			});
			player.addEventListener('resume', () => {
				player.dispatchEvent('wikiaAdPlay');
			});
			player.addEventListener('pause', () => {
				player.dispatchEvent('wikiaAdPause');
			});
			player.addOnDestroyCallback(() => {
				if (viewportListenerId) {
					utils.viewportObserver.removeListener(viewportListenerId);
					viewportListenerId = null;
				}
			});

			if (params.autoPlay) {
				muteFirstPlay(player);
			}

			if (params.onReady) {
				params.onReady(player);
			}

			player.addEventListener('wikiaAdsManagerLoaded', () => {
				setupAutoPlayMethod();
			});
			player.addEventListener('wikiaEmptyAd', () => {
				viewportListenerId = Porvata.addOnViewportChangeListener(params, () => {
					player.dispatchEvent('wikiaFirstTimeInViewport');
					utils.viewportObserver.removeListener(viewportListenerId);
				});
			});

			return player;
		});
	}
}
