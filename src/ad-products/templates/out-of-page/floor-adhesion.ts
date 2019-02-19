import { context, slotTweaker, SlotTweaker, utils } from '@wikia/ad-engine';
import CloseButton from '../interface/close-button';

export class FloorAdhesion {
	static getName() {
		return 'floorAdhesion';
	}

	static getDefaultConfig() {
		return {
			onInit: () => {},
		};
	}

	constructor(adSlot) {
		this.adSlot = adSlot;
		this.config = context.get('templates.floorAdhesion');
	}

	init() {
		const wrapper = this.adSlot.getElement();
		const closeButton = new CloseButton({
			onClick: () => {
				slotTweaker.hide(this.adSlot);
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				utils.logger(FloorAdhesion.getName(), 'closed');
			},
		});

		this.config.onInit();

		wrapper.appendChild(closeButton.render());
		wrapper.classList.add('floor-adhesion');
		wrapper.classList.add('out-of-page-template');

		slotTweaker.adjustIframeByContentSize(this.adSlot);

		utils.logger(FloorAdhesion.getName(), 'init');
	}
}
