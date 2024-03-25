import { PorvataFactory } from './porvata-factory';
import { PorvataListener } from './porvata-listener';
import { PorvataPlayer } from './porvata-player';
import { PorvataSettings } from './porvata-settings';
import { AdSlotEvent } from "../../../../../../core/models";
import { communicationServiceSlot } from "../../../../utils/communication-service-slot";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DomListener } from "../../manipulators/dom-listener";
import { UapParams } from "../../../../utils/universal-ad-package";

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
	vastTargeting;
	viewportHookElement?: HTMLElement;
	viewportOffsetBottom?: number;
	viewportOffsetTop?: number;
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
}

/**
 * @TODO: Consider reimplementation of this class/logic. In my opinion it conflicts with PorvataFactory.
 * 		It does the same thing -- creates Porvata instance, but adds some additional logic which, I believe, could
 * 		be moved to the factory or split into some UI elements/Porvata plugins.
 */
export class Porvata {
	private unsubscribe$ = new Subject<void>();
	constructor(
		private params: UapParams,
		private domListener: DomListener,
	) {}

	private addOnViewportChangeListener(
		// params: PorvataTemplateParams,
		listener: (isVisible: boolean) => void,
	) {
		// return viewportObserver.addListener(
		// 	params.viewportHookElement || params.container,
		// 	listener,
		// 	{
		// 		offsetTop: params.viewportOffsetTop || 0,
		// 		offsetBottom: params.viewportOffsetBottom || 0,
		// 	},
		// );
		return this.domListener.scroll$
			.pipe(
				tap(() => listener),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	createVideoContainer(parent: HTMLElement): HTMLDivElement {
		const container: HTMLElement = document.createElement('div');
		const displayWrapper: HTMLDivElement = document.createElement('div');

		container.classList.add('video-overlay');
		displayWrapper.classList.add('video-display-wrapper');

		container.appendChild(displayWrapper);
		parent.appendChild(container);

		return displayWrapper;
	}

	inject(params: PorvataTemplateParams): Promise<PorvataPlayer> {
		const porvataListener = new PorvataListener({
			adProduct: params.adProduct,
			position: params.slotName,
			src: params.src,
			withAudio: !params.autoPlay,
			withCtp: !params.autoPlay,
		}, this.params);

		let isFirstPlay = true;
		let autoPlayed = false;

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

		return PorvataFactory.create(videoSettings, this.params).then((player: PorvataPlayer) => {
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
					this.addOnViewportChangeListener(inViewportCallback);
				}
			}

			setupAutoPlayMethod.bind(this);

			porvataListener.registerVideoEvents(player);

			player.addEventListener('adCanPlay', () => {
				player.dispatchEvent('wikiaAdStarted');
				communicationServiceSlot.emit(params.slotName, AdSlotEvent.VIDEO_AD_IMPRESSION)
			});
			player.addEventListener('allAdsCompleted', () => {
				if (player.isFullscreen()) {
					player.toggleFullscreen();
				}

				player.setAutoPlay(false);
				player.dispatchEvent('wikiaAdCompleted');
				this.unsubscribe$.next();

				isFirstPlay = false;
				porvataListener.params.withAudio = true;
				porvataListener.params.withCtp = true;
			});
			player.addEventListener('wikiaAdRestart', () => {
				isFirstPlay = false;
			});
			player.addEventListener('start', () => {
				player.dispatchEvent('wikiaAdPlay');
				setupAutoPlayMethod();
			});
			player.addEventListener('resume', () => {
				player.dispatchEvent('wikiaAdPlay');
			});
			player.addEventListener('pause', () => {
				player.dispatchEvent('wikiaAdPause');
			});
			player.addOnDestroyCallback(() => {
				this.unsubscribe$.next();
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
				this.addOnViewportChangeListener(() => {
					player.dispatchEvent('wikiaFirstTimeInViewport');
					this.unsubscribe$.next();
				});
			});

			return player;
		});
	}
}
