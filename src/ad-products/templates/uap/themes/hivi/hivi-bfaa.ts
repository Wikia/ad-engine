import { AdSlot, Dictionary, scrollListener, slotTweaker, utils } from '@ad-engine/core';
import * as EventEmitter from 'eventemitter3';
import { debounce, isUndefined, mapValues, toPlainObject } from 'lodash';
import { PorvataPlayer } from '../../../../video/player/porvata/porvata';
import { animate } from '../../../interface/animate';
import { StickinessCallback } from '../../big-fancy-ad-above';
import {
	CSS_CLASSNAME_FADE_IN_ANIMATION,
	CSS_CLASSNAME_SLIDE_OUT_ANIMATION,
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_CLASSNAME_THEME_RESOLVED,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} from '../../constants';
import { resolvedState } from '../../resolved-state';
import { resolvedStateSwitch } from '../../resolved-state-switch';
import { UapParams, UapState } from '../../universal-ad-package';
import { BigFancyAdHiviTheme } from './hivi-theme';
import { Stickiness } from './stickiness';

const HIVI_RESOLVED_THRESHOLD = 0.995;
const logGroup = 'hivi-bfaa';

export class BfaaHiviTheme extends BigFancyAdHiviTheme {
	static RESOLVED_STATE_EVENT = Symbol('RESOLVED_STATE_EVENT');

	scrollListener: string;
	stickListener: string;
	video: PorvataPlayer;
	isLocked = false;
	stopNextVideo = false;
	onResolvedStateScroll: {
		(): void;
		cancel: () => void;
	} = null;

	constructor(public adSlot: AdSlot, params: UapParams) {
		super(adSlot, params);
		Object.assign(this, toPlainObject(new EventEmitter()));

		if (this.params.isSticky && this.config.stickinessAllowed) {
			this.addStickinessPlugin();
		}

		if (!this.config.defaultStateAllowed) {
			this.params.resolvedStateForced = true;
		}
	}

	private addStickinessPlugin(): void {
		this.addUnstickLogic();
		this.addUnstickButton();
		this.addUnstickEvents();

		utils
			.once((this as any) as EventEmitter, (BfaaHiviTheme.RESOLVED_STATE_EVENT as any) as string)
			.then(() => {
				this.stickListener = scrollListener.addCallback(() => {
					const scrollPosition =
						window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

					if (scrollPosition >= 0) {
						scrollListener.removeCallback(this.stickListener);
						this.stickiness.run();
					}
				});
			});
	}

	onAdReady(): void {
		super.onAdReady();

		if (resolvedState.isResolvedState(this.params)) {
			this.setResolvedState(true);
		} else {
			this.setResolvedState(false);
			resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
			this.scrollListener = scrollListener.addCallback(() => this.updateAdSizes());
			// Manually run update on scroll once
			this.updateAdSizes();
		}

		setTimeout(() => this.addImagesAnimation());
	}

	onVideoReady(video: PorvataPlayer): void {
		this.video = video;
		video.addEventListener('wikiaAdStarted', () => {
			if (this.stopNextVideo) {
				this.stopNextVideo = false;
				video.stop();
				return;
			}

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

	private resetResolvedState(): void {
		const offset: number = this.getHeightDifferenceBetweenStates();

		if (this.isLocked && this.config.defaultStateAllowed && window.scrollY < offset) {
			const aspectRatio: number = this.params.config.aspectRatio.default;

			this.container.style.top = '';
			this.config.mainContainer.style.paddingTop = `${100 / aspectRatio}%`;

			if (this.params.isSticky && this.config.stickinessAllowed) {
				this.unstickImmediately(false);
			}

			this.unlock();
			this.switchImagesInAd(false);
			this.updateAdSizes();

			if (this.config.onResolvedStateResetCallback) {
				this.config.onResolvedStateResetCallback(this.config, this.adSlot, this.params);
			}
		}
	}

	private lock(): void {
		const offset: number = this.getHeightDifferenceBetweenStates();

		this.isLocked = true;
		this.container.classList.add('theme-locked');
		scrollListener.removeCallback(this.scrollListener);
		this.adjustSizesToResolved(offset);
		((this as any) as EventEmitter).emit(BfaaHiviTheme.RESOLVED_STATE_EVENT);
	}

	private unlock(): void {
		this.isLocked = false;
		this.container.classList.remove('theme-locked');
		this.scrollListener = scrollListener.addCallback(() => this.updateAdSizes());
	}

	private adjustSizesToResolved(offset: number): void {
		if (this.adSlot.isEnabled()) {
			const aspectRatio = this.params.config.aspectRatio.resolved;

			this.container.style.top = '';
			this.config.mainContainer.style.paddingTop = `${100 / aspectRatio}%`;
			slotTweaker.makeResponsive(this.adSlot, aspectRatio);
			window.scrollBy(0, -Math.min(offset, window.scrollY));
			this.updateAdSizes();
		}
	}

	private updateAdSizes(): Promise<HTMLElement> {
		const { aspectRatio, state } = this.params.config;
		const currentWidth: number = this.config.mainContainer.offsetWidth;
		const isResolved = this.container.classList.contains(CSS_CLASSNAME_THEME_RESOLVED);
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

	private adjustVideoSize(relativeHeight: number): void {
		if (this.video && !this.video.isFullscreen()) {
			this.video.container.style.width = `${this.params.videoAspectRatio * relativeHeight}px`;
		}
	}

	private setThumbnailStyle(state: number): void {
		const style: Dictionary = mapValues(
			this.params.config.state,
			(styleProperty: UapState<number>) => {
				const diff: number = styleProperty.default - styleProperty.resolved;

				return `${styleProperty.default - diff * state}%`;
			},
		);

		Object.assign(this.params.thumbnail.style, style);

		if (this.video) {
			Object.assign(this.video.container.style, style);

			if (this.video.isFullscreen()) {
				this.video.container.style.height = '100%';
			}
		}
	}

	private setResolvedState(immediately?: boolean): Promise<void> {
		const offset: number = this.getHeightDifferenceBetweenStates();

		this.switchImagesInAd(true);

		if (this.onResolvedStateScroll) {
			window.removeEventListener('scroll', this.onResolvedStateScroll);
			this.onResolvedStateScroll.cancel();
		}

		if (this.config.onResolvedStateSetCallback) {
			this.config.onResolvedStateSetCallback(this.config, this.adSlot, this.params);
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

	private getHeightDifferenceBetweenStates(): number {
		const width: number = this.container.offsetWidth;
		const { aspectRatio } = this.params.config;

		return Math.round(width / aspectRatio.default - width / aspectRatio.resolved);
	}

	private switchImagesInAd(isResolved: boolean): void {
		if (isResolved) {
			this.container.classList.add(CSS_CLASSNAME_THEME_RESOLVED);
		} else {
			this.container.classList.remove(CSS_CLASSNAME_THEME_RESOLVED);
		}

		if (this.params.image2 && this.params.image2.element) {
			if (isResolved) {
				this.params.image2.element.classList.remove('hidden-state');
				this.params.image1.element.classList.add('hidden-state');
			} else {
				this.params.image2.element.classList.add('hidden-state');
				this.params.image1.element.classList.remove('hidden-state');
			}
		} else {
			this.params.image1.element.classList.remove('hidden-state');
		}
	}

	protected async getVideoViewedAndTimeout(): Promise<void> {
		const { stickyUntilSlotViewed } = this.config;
		const { stickyAdditionalTime, stickyUntilVideoViewed } = this.params;
		const slotViewed: Promise<void> = stickyUntilSlotViewed
			? this.adSlot.loaded.then(() => this.adSlot.viewed)
			: Promise.resolve();
		const videoViewed: Promise<void> = stickyUntilVideoViewed
			? utils.once(this.adSlot, AdSlot.VIDEO_VIEWED_EVENT)
			: Promise.resolve();
		const unstickDelay: number = isUndefined(stickyAdditionalTime)
			? BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY
			: stickyAdditionalTime;

		await slotViewed;
		utils.logger(logGroup, 'static slot viewed');

		await videoViewed;
		utils.logger(logGroup, 'video slot viewed');

		await utils.wait(unstickDelay);
		utils.logger(logGroup, 'slot timeout reached');
	}

	protected async onStickinessChange(isSticky: boolean): Promise<void> {
		const stickinessBeforeCallback: StickinessCallback = isSticky
			? this.config.onBeforeStickBfaaCallback
			: this.config.onBeforeUnstickBfaaCallback;
		const stickinessAfterCallback: StickinessCallback = isSticky
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
			this.stickNavbar();
			this.adSlot.emitEvent(Stickiness.SLOT_STICKED_STATE);
			this.adSlot.getElement().classList.add(CSS_CLASSNAME_STICKY_BFAA);
		}

		stickinessAfterCallback.call(this.config, this.adSlot, this.params);
	}

	private stickNavbar(): void {
		const width: number = this.container.offsetWidth;
		const { aspectRatio } = this.params.config;
		const resolvedHeight: number = width / aspectRatio.resolved;

		this.config.moveNavbar(resolvedHeight, SLIDE_OUT_TIME);
	}

	protected onCloseClicked(): void {
		this.adSlot.emitEvent(Stickiness.SLOT_FORCE_UNSTICK);
		this.unstickImmediately();
	}

	protected unstickImmediately(stopVideo = true): void {
		scrollListener.removeCallback(this.scrollListener);
		this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAA);

		if (stopVideo) {
			this.stopVideoPlayback();
		}

		this.config.onAfterUnstickBfaaCallback.call(this.config, this.adSlot, this.params);
		this.stickiness.sticky = false;
		this.removeUnstickButton();
	}

	private stopVideoPlayback() {
		if (this.video && this.video.ima.getAdsManager() && this.video.ima.status) {
			if (this.video.isPlaying()) {
				this.video.stop();
			}
		} else {
			this.stopNextVideo = true;
		}

		this.setResolvedState(true);
	}
}
