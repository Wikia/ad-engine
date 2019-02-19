import { PorvataListener } from '../../../listeners';
import { client, LazyQueue, tryProperty, viewportObserver, whichProperty } from '../../../utils';
import { googleIma } from './ima/google-ima';
import { VideoSettings } from './video-settings';

const VIDEO_FULLSCREEN_CLASS_NAME = 'video-player-fullscreen';
const STOP_SCROLLING_CLASS_NAME = 'stop-scrolling';

const prepareVideoAdContainer = (params) => {
	const videoAdContainer = params.container.querySelector('div');

	videoAdContainer.classList.add('video-player');
	videoAdContainer.classList.add('hide');

	return videoAdContainer;
};

const nativeFullscreenOnElement = (element) => {
	const enter = tryProperty(element, [
		'webkitRequestFullscreen',
		'mozRequestFullScreen',
		'msRequestFullscreen',
		'requestFullscreen',
	]);
	const exit = tryProperty(document, [
		'webkitExitFullscreen',
		'mozCancelFullScreen',
		'msExitFullscreen',
		'exitFullscreen',
	]);
	const fullscreenChangeEvent = (
		whichProperty(document, [
			'onwebkitfullscreenchange',
			'onmozfullscreenchange',
			'onmsfullscreenchange',
			'onfullscreenchange',
		]) || ''
	)
		.replace(/^on/, '')
		.replace('msfullscreenchange', 'MSFullscreenChange');
	const addChangeListener = (...args) => document.addEventListener(fullscreenChangeEvent, ...args);
	const removeChangeListener = (...args) =>
		document.removeEventListener(fullscreenChangeEvent, ...args);
	const isSupported = () => Boolean(enter && exit);

	return {
		enter,
		exit,
		addChangeListener,
		removeChangeListener,
		isSupported,
	};
};

export class PorvataPlayer {
	constructor(ima, params, videoSettings) {
		this.ima = ima;
		this.container = prepareVideoAdContainer(params);
		this.mobileVideoAd = params.container.querySelector('video');
		this.params = params;
		this.videoSettings = videoSettings;
		this.isFloating = false;

		const nativeFullscreen = nativeFullscreenOnElement(this.container);

		this.fullscreen = Boolean(params.isFullscreen);
		this.nativeFullscreen = nativeFullscreen;
		this.width = params.width;
		this.height = params.height;
		this.muteProtect = false;
		this.defaultVolume = 0.75;

		this.destroyCallbacks = new LazyQueue();
		this.destroyCallbacks.onItemFlush((callback) => callback());

		if (nativeFullscreen.isSupported()) {
			nativeFullscreen.addChangeListener(() => this.onFullscreenChange());
		}
	}

	addEventListener(eventName, callback) {
		this.ima.addEventListener(eventName, callback);
	}

	getRemainingTime() {
		return this.ima.getAdsManager().getRemainingTime();
	}

	isFullscreen() {
		return this.fullscreen;
	}

	isMuted() {
		return this.ima.getAdsManager().getVolume() === 0;
	}

	isMobilePlayerMuted() {
		const mobileVideoAd = this.container.querySelector('video');

		return mobileVideoAd && mobileVideoAd.autoplay && mobileVideoAd.muted;
	}

	isPaused() {
		return this.ima.getStatus() === 'paused';
	}

	isPlaying() {
		return this.ima.getStatus() === 'playing';
	}

	pause() {
		this.ima.getAdsManager().pause();
	}

	play(newWidth, newHeight) {
		if (newWidth !== undefined && newHeight !== undefined) {
			this.width = newWidth;
			this.height = newHeight;
		}
		if (!this.width || !this.height || this.isFullscreen()) {
			this.width = this.params.container.offsetWidth;
			this.height = this.params.container.offsetHeight;
		}

		this.ima.playVideo(this.width, this.height);
	}

	reload() {
		this.ima.reload();
	}

	resize(newWidth, newHeight) {
		if (isFinite(newWidth) && isFinite(newHeight)) {
			this.width = newWidth;
			this.height = newHeight;
		}

		if (this.isFullscreen()) {
			this.ima.resize(window.innerWidth, window.innerHeight, true);
		} else {
			this.ima.resize(this.width, this.height, false);
		}
	}

	resume() {
		this.ima.getAdsManager().resume();
	}

	rewind() {
		this.params.autoPlay = false;
		this.ima.setAutoPlay(false);
		this.ima.dispatchEvent('wikiaAdRestart');
		this.play();
	}

	setVolume(volume) {
		this.updateVideoDOMElement(volume);
		this.ima.getAdsManager().setVolume(volume);

		// This is hack for Safari, because it can't dispatch original IMA event (volumeChange)
		this.ima.dispatchEvent('wikiaVolumeChange');
	}

	toggleFullscreen() {
		const isFullscreen = this.isFullscreen();
		const { nativeFullscreen } = this;

		this.muteProtect = true;

		if (nativeFullscreen.isSupported()) {
			const toggleNativeFullscreen = isFullscreen ? nativeFullscreen.exit : nativeFullscreen.enter;

			toggleNativeFullscreen();
		} else {
			this.onFullscreenChange();
		}
	}

	onFullscreenChange() {
		this.fullscreen = !this.fullscreen;

		if (this.isFullscreen()) {
			this.container.classList.add(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.add(STOP_SCROLLING_CLASS_NAME);
		} else {
			this.container.classList.remove(VIDEO_FULLSCREEN_CLASS_NAME);
			document.documentElement.classList.remove(STOP_SCROLLING_CLASS_NAME);

			if (this.muteProtect) {
				this.muteProtect = false;
			} else if (this.isPlaying() && !this.isMuted()) {
				this.mute();
			}
		}

		this.resize();
		this.ima.dispatchEvent('wikiaFullscreenChange');
	}

	updateVideoDOMElement(volume) {
		if (this.mobileVideoAd) {
			this.mobileVideoAd.muted = volume === 0;
			this.mobileVideoAd.volume = volume;
		}
	}

	mute() {
		this.setVolume(0);
	}

	unmute() {
		this.setVolume(this.defaultVolume);

		if (this.params.autoPlay && this.params.restartOnUnmute) {
			this.rewind();
		}
	}

	volumeToggle() {
		if (this.isMuted()) {
			this.unmute();
			this.ima.dispatchEvent('wikiaAdUnmute');
		} else {
			this.mute();
			this.ima.dispatchEvent('wikiaAdMute');
		}
	}

	stop() {
		this.ima.getAdsManager().stop();
		this.ima.dispatchEvent('wikiaAdStop');
	}

	addOnDestroyCallback(callback) {
		this.destroyCallbacks.push(callback);
	}

	destroy() {
		this.destroyCallbacks.flush();
	}
}

export class Porvata {
	/**
	 * @private
	 * @returns listener id
	 */
	static addOnViewportChangeListener(params, listener) {
		return viewportObserver.addListener(params.viewportHookElement || params.container, listener, {
			offsetTop: params.viewportOffsetTop || 0,
			offsetBottom: params.viewportOffsetBottom || 0,
		});
	}

	static inject(params) {
		const porvataListener = new PorvataListener({
			adProduct: params.adProduct,
			position: params.slotName,
			src: params.src,
			withAudio: !params.autoPlay,
			withCtp: !params.autoPlay,
		});

		let isFirstPlay = true;
		let autoPaused = false;
		let autoPlayed = false;
		let viewportListenerId = null;

		function muteFirstPlay(video) {
			video.addEventListener('loaded', () => {
				if (isFirstPlay) {
					video.mute();
				}
			});
		}

		params.vastTargeting = params.vastTargeting || {
			passback: 'porvata',
		};

		const videoSettings = new VideoSettings(params);

		porvataListener.init();

		return googleIma
			.load()
			.then(() => googleIma.getPlayer(videoSettings))
			.then((ima) => new PorvataPlayer(ima, params, videoSettings))
			.then((video) => {
				function inViewportCallback(isVisible) {
					// Play video automatically only for the first time
					if (isVisible && !autoPlayed && params.autoPlay) {
						video.ima.dispatchEvent('wikiaFirstTimeInViewport');
						video.play();
						autoPlayed = true;
						// Don't resume when video was paused manually
					} else if (isVisible && autoPaused) {
						video.resume();
						// Pause video once it's out of viewport and set autoPaused to distinguish manual
						// and auto pause
					} else if (!isVisible && video.isPlaying() && !params.blockOutOfViewportPausing) {
						video.pause();
						autoPaused = true;
					}
				}

				function setupAutoPlayMethod() {
					if (params.blockOutOfViewportPausing && !params.startInViewportOnly) {
						if (params.autoPlay && !autoPlayed) {
							autoPlayed = true;
							video.play();
						}
					} else {
						viewportListenerId = Porvata.addOnViewportChangeListener(params, inViewportCallback);
					}
				}

				porvataListener.registerVideoEvents(video);

				video.addEventListener('adCanPlay', () => {
					video.ima.dispatchEvent('wikiaAdStarted');
				});
				video.addEventListener('allAdsCompleted', () => {
					if (video.isFullscreen()) {
						video.toggleFullscreen();
					}

					video.ima.setAutoPlay(false);
					video.ima.dispatchEvent('wikiaAdCompleted');
					if (viewportListenerId) {
						viewportObserver.removeListener(viewportListenerId);
						viewportListenerId = null;
					}
					isFirstPlay = false;
					porvataListener.params.withAudio = true;
					porvataListener.params.withCtp = true;
				});
				video.addEventListener('wikiaAdRestart', () => {
					isFirstPlay = false;
				});
				video.addEventListener('start', () => {
					video.ima.dispatchEvent('wikiaAdPlay');
					if (!viewportListenerId && !autoPlayed) {
						setupAutoPlayMethod();
					}
				});
				video.addEventListener('resume', () => {
					video.ima.dispatchEvent('wikiaAdPlay');
					autoPaused = false;
				});
				video.addEventListener('pause', () => {
					video.ima.dispatchEvent('wikiaAdPause');
				});
				video.addOnDestroyCallback(() => {
					if (viewportListenerId) {
						viewportObserver.removeListener(viewportListenerId);
						viewportListenerId = null;
					}
				});

				if (params.autoPlay) {
					muteFirstPlay(video);
				}

				if (params.onReady) {
					params.onReady(video);
				}

				video.addEventListener('wikiaAdsManagerLoaded', () => {
					setupAutoPlayMethod();
				});
				video.addEventListener('wikiaEmptyAd', () => {
					viewportListenerId = Porvata.addOnViewportChangeListener(params, () => {
						video.ima.dispatchEvent('wikiaFirstTimeInViewport');
						viewportObserver.removeListener(viewportListenerId);
					});
				});

				return video;
			});
	}

	static isVpaid(contentType) {
		return contentType === 'application/javascript';
	}

	static isVideoAutoplaySupported() {
		const isAndroid = client.getOperatingSystem() === 'Android';
		const browser = client.getBrowser().split(' ');
		const isCompatibleChrome =
			browser[0].indexOf('Chrome') !== -1 && parseInt(browser[1], 10) >= 54;

		return !isAndroid || isCompatibleChrome;
	}
}
