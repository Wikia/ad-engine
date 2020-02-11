import { AdSlot, context, slotTweaker } from '@ad-engine/core';
import { AdvertisementLabel } from '../../../interface/advertisement-label';
import { CloseButton } from '../../../interface/close-button';
import { BigFancyAdAboveConfig } from '../../big-fancy-ad-above';
import { resolvedState } from '../../resolved-state';
import { UapVideoSettings } from '../../uap-video-settings';
import { UapParams } from '../../universal-ad-package';
import { BigFancyAdTheme } from '../theme';
import { CustomWhen, Stickiness } from './stickiness';

export abstract class BigFancyAdHiviTheme extends BigFancyAdTheme {
	static DEFAULT_UNSTICK_DELAY = 3000;

	closeButton: HTMLElement;
	protected stickiness: Stickiness;
	protected config: BigFancyAdAboveConfig;

	constructor(adSlot: AdSlot, params: UapParams) {
		super(adSlot, params);
		this.config = context.get('templates.bfaa') || {};
	}

	onAdReady(): void {
		this.container.classList.add('theme-hivi');
		this.addAdvertisementLabel();
	}

	async adIsReady(videoSettings: UapVideoSettings): Promise<HTMLIFrameElement | HTMLElement> {
		const aspectRatios = this.params.config.aspectRatio;
		const ratio = resolvedState.isResolvedState(this.params)
			? aspectRatios.resolved
			: aspectRatios.default;

		return slotTweaker.makeResponsive(this.adSlot, ratio);
	}

	addAdvertisementLabel(): void {
		const advertisementLabel = new AdvertisementLabel();

		this.container.appendChild(advertisementLabel.render());
	}

	protected addUnstickLogic(): void {
		const { stickyUntilSlotViewed } = this.config;
		const videoViewedAndTimeout = this.getVideoViewedAndTimeout();

		this.stickiness = new Stickiness(this.adSlot, videoViewedAndTimeout, stickyUntilSlotViewed);
	}

	protected abstract getVideoViewedAndTimeout(): CustomWhen;

	protected addUnstickButton(): void {
		this.closeButton = new CloseButton({
			classNames: ['button-unstick'],
			onClick: () => this.stickiness.close(),
		}).render();

		this.container.appendChild(this.closeButton);
	}

	protected removeUnstickButton(): void {
		this.closeButton.remove();
	}

	protected addUnstickEvents(): void {
		this.stickiness.on(Stickiness.STICKINESS_CHANGE_EVENT, (isSticky) =>
			this.onStickinessChange(isSticky),
		);
		this.stickiness.on(Stickiness.CLOSE_CLICKED_EVENT, () => this.onCloseClicked());
		this.stickiness.on(Stickiness.UNSTICK_IMMEDIATELY_EVENT, (arg) => this.unstickImmediately(arg));
	}

	protected addImagesAnimation() {
		if (this.params.image1 && this.params.image1.element) {
			this.params.image1.element.classList.add('background-transition');
		}

		if (this.params.image2 && this.params.image2.element) {
			this.params.image2.element.classList.add('background-transition');
		}
	}

	protected abstract onStickinessChange(isSticky: boolean): void;

	protected abstract onCloseClicked(): void;

	protected abstract unstickImmediately(stopVideo: boolean): void;
}
