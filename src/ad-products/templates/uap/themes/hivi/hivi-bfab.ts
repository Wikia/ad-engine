import {
	context,
	scrollListener,
	slotService,
	slotTweaker,
	SlotTweaker,
	utils,
} from '@ad-engine/core';
import { mapValues } from 'lodash';
import { PorvataPlayer } from '../../../../video/player/porvata/porvata';
import { animate } from '../../../interface/animate';
import { BigFancyAdBelowConfig } from '../../big-fancy-ad-below';
import {
	CSS_CLASSNAME_FADE_IN_ANIMATION,
	CSS_CLASSNAME_SLIDE_OUT_ANIMATION,
	CSS_CLASSNAME_STICKY_BFAB,
	CSS_CLASSNAME_THEME_RESOLVED,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} from '../../constants';
import { resolvedState } from '../../resolved-state';
import { resolvedStateSwitch } from '../../resolved-state-switch';
import { BigFancyAdHiviTheme } from './hivi-theme';
import { Stickiness } from './stickiness';

export class BfabHiviTheme extends BigFancyAdHiviTheme {
	protected config: BigFancyAdBelowConfig;
	private video: PorvataPlayer;

	constructor(adSlot, params) {
		super(adSlot, params);

		this.config = context.get('templates.bfab') || {};
	}

	onAdReady(): void {
		super.onAdReady();

		if (this.params.isSticky && this.config.stickinessAllowed) {
			this.addStickinessPlugin();
		}

		if (!this.config.defaultStateAllowed) {
			this.params.resolvedStateForced = true;
		}

		if (resolvedState.isResolvedState(this.params)) {
			this.setResolvedState();
		} else {
			resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
			this.updateAdSizes();
			slotTweaker.makeResponsive(this.adSlot, this.params.config.aspectRatio.default);
		}
	}

	private async addStickinessPlugin(): Promise<void> {
		await this.waitForScrollAndUnstickedBfaa();

		if (!this.adSlot.isViewed()) {
			this.addUnstickLogic();
			this.addUnstickButton();
			this.addUnstickEvents();
			this.stickiness.run();

			scrollListener.addCallback((event, id) => {
				const scrollPosition =
					window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

				if (scrollPosition <= this.config.unstickInstantlyBelowPosition) {
					this.adSlot.emitEvent('top-conflict');
					scrollListener.removeCallback(id);
					this.stickiness.revertStickiness();
				}
			});
		}
	}

	private waitForScrollAndUnstickedBfaa(): Promise<unknown> {
		let resolvePromise = null;

		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		const bfaa = slotService.get(this.config.bfaaSlotName);

		const cbId = scrollListener.addCallback((event, id) => {
			const scrollPosition =
				window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
			const slotPosition = utils.getTopOffset(this.adSlot.getElement());
			const isBfaaSticky = bfaa.getElement().classList.contains('sticky-bfaa');
			const bfaaHeight = bfaa.getElement().offsetHeight;

			if (isBfaaSticky && scrollPosition >= slotPosition - this.config.topThreshold - bfaaHeight) {
				scrollListener.removeCallback(id);
				this.adSlot.emitEvent('viewport-conflict');
			} else if (scrollPosition >= slotPosition - this.config.topThreshold && !isBfaaSticky) {
				scrollListener.removeCallback(id);
				resolvePromise();
			}
		});
		this.adSlot.viewed.then(() => {
			scrollListener.removeCallback(cbId);
		});

		return promise;
	}

	onVideoReady(video: PorvataPlayer): void {
		this.video = video;
		video.addEventListener('wikiaAdStarted', () => this.updateAdSizes());
		video.addEventListener('wikiaAdCompleted', () => this.setResolvedState());
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

	private updateAdSizes(): void {
		const state = resolvedState.isResolvedState(this.params) ? 'resolved' : 'default';
		const stateHeight = this.params.config.state.height[state];
		const relativeHeight = this.params.container.offsetHeight * (stateHeight / 100);

		this.adjustVideoSize(relativeHeight);

		if (this.params.thumbnail) {
			this.setThumbnailStyle(state);
		}
	}

	private adjustVideoSize(relativeHeight): void {
		if (this.video && !this.video.isFullscreen()) {
			this.video.container.style.width = `${this.params.videoAspectRatio * relativeHeight}px`;
		}
	}

	private async setResolvedState(): Promise<void> {
		const { config, image2 } = this.params;

		this.container.classList.add(CSS_CLASSNAME_THEME_RESOLVED);
		image2.element.classList.remove('hidden-state');
		await slotTweaker.makeResponsive(this.adSlot, config.aspectRatio.resolved);

		if (this.params.thumbnail) {
			this.setThumbnailStyle('resolved');
		}
	}

	private setThumbnailStyle(state = 'default'): void {
		const { thumbnail } = this.params;
		const style = mapValues(
			this.params.config.state,
			(styleProperty) => `${styleProperty[state]}%`,
		);

		Object.assign(thumbnail.style, style);

		if (this.video) {
			Object.assign(this.video.container.style, style);
		}
	}

	protected async getVideoViewedAndTimeout(): Promise<void> {
		await utils.wait(BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY);
	}

	protected async onStickinessChange(isSticky: boolean): Promise<void> {
		const element: HTMLElement = this.adSlot.getElement();

		if (!isSticky) {
			if (this.adSlot.getStatus() !== 'top-conflict') {
				await animate(this.adSlot.getElement(), CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);
			}
			this.adSlot.emitEvent(Stickiness.SLOT_UNSTICKED_STATE);
			element.style.top = null;
			(element.parentNode as HTMLElement).style.height = null;
			element.classList.remove(CSS_CLASSNAME_STICKY_BFAB);
			animate(this.adSlot.getElement(), CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
		} else {
			this.adSlot.emitEvent(Stickiness.SLOT_STICKED_STATE);
			(element.parentNode as HTMLElement).style.height = `${element.offsetHeight}px`;
			element.classList.add(CSS_CLASSNAME_STICKY_BFAB);
			element.style.top = `${this.config.topThreshold}px`;
		}
	}

	protected onCloseClicked(): void {
		this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
		this.unstickImmediately();

		(this.adSlot.getElement().parentNode as HTMLElement).style.height = null;
		this.adSlot.disable();
		this.adSlot.hide();
	}

	protected unstickImmediately(stopVideo = false): void {
		if (this.stickiness) {
			this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAB);

			if (stopVideo && this.video && this.video.ima.getAdsManager()) {
				this.video.stop();
			}

			this.stickiness.sticky = false;
		}
	}
}
