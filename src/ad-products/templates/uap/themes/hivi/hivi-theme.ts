import { slotTweaker, utils } from '@ad-engine/core';
import AdvertisementLabel from '../../../interface/advertisement-label';
import { CloseButton } from '../../../interface/close-button';
import { BigFancyAdTheme } from '../theme';
import { Stickiness } from './stickiness';

/**
 * @abstract
 */
export class BigFancyAdHiviTheme extends BigFancyAdTheme {
	static DEFAULT_UNSTICK_DELAY = 3000;

	closeButton: HTMLElement;

	onAdReady() {
		this.container.classList.add('theme-hivi');
		this.addAdvertisementLabel();
	}

	async adIsReady() {
		return slotTweaker.makeResponsive(this.adSlot, this.params.aspectRatio);
	}

	addAdvertisementLabel() {
		const advertisementLabel = new AdvertisementLabel();

		this.container.appendChild(advertisementLabel.render());
	}

	/**
	 * @protected
	 */
	addUnstickLogic() {
		const { stickyUntilSlotViewed } = this.config;
		const videoViewedAndTimeout = this.getVideoViewedAndTimeout();

		this.stickiness = new Stickiness(this.adSlot, videoViewedAndTimeout, stickyUntilSlotViewed);
	}

	/**
	 * @abstract
	 * @protected
	 */
	getVideoViewedAndTimeout() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @protected
	 */
	addUnstickButton() {
		this.closeButton = new CloseButton({
			classNames: ['button-unstick'],
			onClick: () => this.stickiness.close(),
		}).render();

		this.container.appendChild(this.closeButton);
	}

	/**
	 * @protected
	 */
	removeUnstickButton() {
		this.closeButton.remove();
	}

	/**
	 * @protected
	 */
	addUnstickEvents() {
		this.stickiness.on(Stickiness.STICKINESS_CHANGE_EVENT, (isSticky) =>
			this.onStickinessChange(isSticky),
		);
		this.stickiness.on(Stickiness.CLOSE_CLICKED_EVENT, () => this.onCloseClicked());
		this.stickiness.on(Stickiness.UNSTICK_IMMEDIATELY_EVENT, (arg) => this.unstickImmediately(arg));
	}

	/**
	 * @abstract
	 * @protected
	 */
	onStickinessChange(isSticky) {
		throw new utils.NotImplementedException({ isSticky });
	}

	/**
	 * @abstract
	 * @protected
	 */
	onCloseClicked() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @abstract
	 * @protected
	 * @param stopVideo {boolean}
	 */
	unstickImmediately(stopVideo) {
		throw new utils.NotImplementedException({ stopVideo });
	}
}
