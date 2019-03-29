import { AdSlot, scrollListener, slotTweaker, utils } from '@wikia/ad-engine';
import EventEmitter from 'eventemitter3';
import { debounce, isUndefined, mapValues, toPlainObject } from 'lodash';
import { animate } from '../../../interface/animate';
import {
	CSS_CLASSNAME_FADE_IN_ANIMATION,
	CSS_CLASSNAME_SLIDE_OUT_ANIMATION,
	CSS_CLASSNAME_STICKY_BFAA,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} from '../../constants';
import { resolvedState } from '../../resolved-state';
import { resolvedStateSwitch } from '../../resolved-state-switch';
import { BigFancyAdHiviTheme } from './hivi-theme';
import { Stickiness } from './stickiness';

const HIVI_RESOLVED_THRESHOLD = 0.995;

export class BfaaHiviTheme extends BigFancyAdHiviTheme {
	static RESOLVED_STATE_EVENT = Symbol('RESOLVED_STATE_EVENT');

	constructor(adSlot, params) {
		super(adSlot, params);
		Object.assign(this, toPlainObject(new EventEmitter()));

		this.stickiness = null;
		this.scrollListener = null;
		this.video = null;
		this.isLocked = false;
		this.onResolvedStateScroll = null;

		if (this.params.isSticky && this.config.stickinessAllowed) {
			this.addStickinessPlugin();
		}

		if (!this.config.defaultStateAllowed) {
			this.params.resolvedStateForced = true;
		}
	}

	/**
	 * @private
	 */
	addStickinessPlugin() {
		this.addUnstickLogic();
		this.addUnstickButton();
		this.addUnstickEvents();
		this.stickiness.run();
	}

	onAdReady() {
		super.onAdReady();

		if (resolvedState.isResolvedState(this.params)) {
			this.setResolvedState(true);
		} else {
			resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
			this.scrollListener = scrollListener.addCallback(() => this.updateAdSizes());
			// Manually run update on scroll once
			this.updateAdSizes();
		}
	}

	onVideoReady(video) {
		this.video = video;
		video.addEventListener('wikiaAdStarted', () => {
			this.updateAdSizes();

			if (!video.params.autoPlay) {
				this.resetResolvedState();
			}
		});
		video.addEventListener('wikiaAdCompleted', () => {
			if (!this.isLocked) {
				this.setResolvedState(true);
			}
		});
		video.addEventListener('wikiaFullscreenChange', () => {
			if (video.isFullscreen()) {
				this.stickiness.blockRevertStickiness();
				this.container.classList.add('theme-video-fullscreen');
			} else {
				this.stickiness.unblockRevertStickiness();
				this.container.classList.remove('theme-video-fullscreen');
				this.updateAdSizes();
			}
		});
	}

	/**
	 * @private
	 */
	resetResolvedState() {
		const offset = this.getHeightDifferenceBetweenStates();

		if (this.isLocked && this.config.defaultStateAllowed && window.scrollY < offset) {
			const aspectRatio = this.params.config.aspectRatio.default;

			this.container.style.top = '';
			this.config.mainContainer.style.paddingTop = `${100 / aspectRatio}%`;

			if (this.params.isSticky && this.config.stickinessAllowed) {
				this.unstickImmediately(false);
			}

			this.unlock();
			this.switchImagesInAd(false);
			this.setResolvedState(false);
			this.updateAdSizes();
		}
	}

	/**
	 * @private
	 */
	lock() {
		const offset = this.getHeightDifferenceBetweenStates();

		this.isLocked = true;
		this.container.classList.add('theme-locked');
		scrollListener.removeCallback(this.scrollListener);
		this.adjustSizesToResolved(offset);
		this.emit(BfaaHiviTheme.RESOLVED_STATE_EVENT);
	}

	/**
	 * @private
	 */
	unlock() {
		this.isLocked = false;
		this.container.classList.remove('theme-locked');
		this.scrollListener = scrollListener.addCallback(() => this.updateAdSizes());
	}

	/**
	 * @private
	 */
	adjustSizesToResolved(offset) {
		if (this.adSlot.isEnabled()) {
			const aspectRatio = this.params.config.aspectRatio.resolved;

			this.container.style.top = '';
			this.config.mainContainer.style.paddingTop = `${100 / aspectRatio}%`;
			slotTweaker.makeResponsive(this.adSlot, aspectRatio);
			window.scrollBy(0, -Math.min(offset, window.scrollY));
			this.updateAdSizes();
		}
	}

	/**
	 * @private
	 */
	updateAdSizes() {
		const { aspectRatio, state } = this.params.config;
		const {
			mainContainer: { offsetWidth: currentWidth },
		} = this.config;
		const isResolved = this.container.classList.contains('theme-resolved');
		const maxHeight = currentWidth / aspectRatio.default;
		const minHeight = currentWidth / aspectRatio.resolved;
		const scrollY = window.scrollY || window.pageYOffset || 0;
		const aspectScroll = this.isLocked ? minHeight : Math.max(minHeight, maxHeight - scrollY);
		const currentAspectRatio = currentWidth / aspectScroll;
		const aspectRatioDiff = aspectRatio.default - aspectRatio.resolved;
		const currentDiff = aspectRatio.default - currentAspectRatio;
		const currentState = 1 - (aspectRatioDiff - currentDiff) / aspectRatioDiff;
		const heightDiff = state.height.default - state.height.resolved;
		const heightFactor = (state.height.default - heightDiff * currentState) / 100;
		const relativeHeight = aspectScroll * heightFactor;

		this.adjustVideoSize(relativeHeight);

		if (this.params.thumbnail) {
			this.setThumbnailStyle(currentState);
		}

		if (currentState >= HIVI_RESOLVED_THRESHOLD && !isResolved) {
			this.setResolvedState();
		} else if (currentState < HIVI_RESOLVED_THRESHOLD && isResolved) {
			this.container.style.top = '';
			this.switchImagesInAd(false);
		}

		return slotTweaker.makeResponsive(this.adSlot, currentAspectRatio);
	}

	/**
	 * @private
	 */
	adjustVideoSize(relativeHeight) {
		if (this.video && !this.video.isFullscreen()) {
			this.video.container.style.width = `${this.params.videoAspectRatio * relativeHeight}px`;
		}
	}

	/**
	 * @private
	 */
	setThumbnailStyle(state) {
		const style = mapValues(this.params.config.state, (styleProperty) => {
			const diff = styleProperty.default - styleProperty.resolved;

			return `${styleProperty.default - diff * state}%`;
		});

		Object.assign(this.params.thumbnail.style, style);

		if (this.video) {
			Object.assign(this.video.container.style, style);

			if (this.video.isFullscreen()) {
				this.video.container.style.height = '100%';
			}
		}
	}

	/**
	 * @private
	 */
	setResolvedState(immediately) {
		const isSticky = this.stickiness && this.stickiness.isSticky();
		const width = this.container.offsetWidth;
		const { aspectRatio } = this.params.config;
		const resolvedHeight = width / aspectRatio.resolved;
		const offset = this.getHeightDifferenceBetweenStates();

		if (isSticky) {
			this.config.moveNavbar(resolvedHeight, SLIDE_OUT_TIME);
		} else {
			this.container.style.top = `${Math.min(window.scrollY, offset)}px`;
		}

		this.switchImagesInAd(true);

		if (this.onResolvedStateScroll) {
			window.removeEventListener('scroll', this.onResolvedStateScroll);
			this.onResolvedStateScroll.cancel();
		}

		return new Promise((resolve) => {
			if (immediately) {
				this.lock();
				resolve();
			} else {
				this.onResolvedStateScroll = debounce(() => {
					if (window.scrollY < offset) {
						return;
					}

					window.removeEventListener('scroll', this.onResolvedStateScroll);
					this.onResolvedStateScroll = null;
					this.lock();
					resolve();
				}, 50);
				window.addEventListener('scroll', this.onResolvedStateScroll);
				this.onResolvedStateScroll();
			}
		});
	}

	/**
	 * @private
	 */
	getHeightDifferenceBetweenStates() {
		const width = this.container.offsetWidth;
		const { aspectRatio } = this.params.config;

		return Math.round(width / aspectRatio.default - width / aspectRatio.resolved);
	}

	/**
	 * @private
	 */
	switchImagesInAd(isResolved) {
		if (isResolved) {
			this.container.classList.add('theme-resolved');
			this.params.image2.element.classList.remove('hidden-state');
		} else {
			this.container.classList.remove('theme-resolved');
			this.params.image2.element.classList.add('hidden-state');
		}
	}

	/**
	 * @protected
	 */
	async getStateResolvedAndVideoViewed() {
		const { stickyAdditionalTime, stickyUntilVideoViewed } = this.params;
		const stateResolved = utils.once(this, BfaaHiviTheme.RESOLVED_STATE_EVENT);
		const videoViewed = stickyUntilVideoViewed
			? utils.once(this.adSlot, AdSlot.VIDEO_VIEWED_EVENT)
			: Promise.resolve();
		const unstickDelay = isUndefined(stickyAdditionalTime)
			? BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY
			: stickyAdditionalTime;

		await Promise.all([stateResolved, videoViewed]);
		await utils.wait(unstickDelay);
	}

	/**
	 * @protected
	 */
	async onStickinessChange(isSticky) {
		const stickinessBeforeCallback = isSticky
			? this.config.onBeforeStickBfaaCallback
			: this.config.onBeforeUnstickBfaaCallback;
		const stickinessAfterCallback = isSticky
			? this.config.onAfterStickBfaaCallback
			: this.config.onAfterUnstickBfaaCallback;

		stickinessBeforeCallback.call(this.config, this.adSlot, this.params);

		if (!isSticky) {
			this.removeUnstickButton();
			this.adSlot.emitEvent(Stickiness.SLOT_UNSTICKED_STATE);
			this.config.moveNavbar(0, SLIDE_OUT_TIME);
			await animate(this.adSlot.getElement(), CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);
			this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAA);
			animate(this.adSlot.getElement(), CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
		} else {
			this.adSlot.emitEvent(Stickiness.SLOT_STICKED_STATE);
			this.adSlot.getElement().classList.add(CSS_CLASSNAME_STICKY_BFAA);
		}

		stickinessAfterCallback.call(this.config, this.adSlot, this.params);
	}

	/**
	 * @protected
	 */
	onCloseClicked() {
		this.unstickImmediately();
	}

	/**
	 * @protected
	 */
	unstickImmediately(stopVideo = true) {
		scrollListener.removeCallback(this.scrollListener);
		this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAA);

		if (stopVideo && this.video && this.video.ima.getAdsManager()) {
			this.video.stop();
		}

		this.config.onAfterUnstickBfaaCallback.call(this.config, this.adSlot, this.params);
		this.stickiness.sticky = false;
		this.removeUnstickButton();
	}
}
