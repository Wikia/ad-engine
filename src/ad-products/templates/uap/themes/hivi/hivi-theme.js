import { slotTweaker, utils } from '@wikia/ad-engine';
import AdvertisementLabel from '../../../interface/advertisement-label';
import { BigFancyAdTheme } from '../theme';
import CloseButton from '../../../interface/close-button';
import { Stickiness } from './stickiness';

/**
 * @abstract
 */
export class BigFancyAdHiviTheme extends BigFancyAdTheme {
	static DEFAULT_UNSTICK_DELAY = 3000;

	onAdReady() {
		super.onAdReady();
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
		const stateResolvedAndVideoViewed = this.getStateResolvedAndVideoViewed();

		this.stickiness = new Stickiness(this.adSlot, stateResolvedAndVideoViewed);
	}

	/**
	 * @abstract
	 * @protected
	 */
	getStateResolvedAndVideoViewed() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @protected
	 */
	addUnstickButton() {
		const closeButton = new CloseButton({
			classNames: ['button-unstick'],
			onClick: () => this.stickiness.close(),
		});

		this.container.appendChild(closeButton.render());
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
	 * */
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
