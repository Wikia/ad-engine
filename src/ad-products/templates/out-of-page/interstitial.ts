import {
	AdSlot,
	context,
	events,
	eventService,
	SlotTweaker,
	slotTweaker,
	utils,
} from '@ad-engine/core';
import AdvertisementLabel from '../interface/advertisement-label';
import { CloseButton } from '../interface/close-button';

export class Interstitial {
	static getName() {
		return 'interstitial';
	}

	static getDefaultConfig() {
		return {
			onInit: () => {},
		};
	}

	constructor(public adSlot: AdSlot) {
		this.config = context.get('templates.interstitial') || {};
	}

	init() {
		const wrapper = this.adSlot.getElement();
		const closeButton = new CloseButton({
			onClick: () => {
				document.documentElement.classList.remove('stop-scrolling');
				this.adSlot.hide();
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				utils.logger(Interstitial.getName(), 'closed');
			},
		});
		const label = new AdvertisementLabel();

		this.config.onInit(this.adSlot);

		wrapper.appendChild(closeButton.render());
		wrapper.appendChild(label.render());
		wrapper.classList.add('interstitial');
		wrapper.classList.add('out-of-page-template');
		document.documentElement.classList.add('stop-scrolling');

		slotTweaker.adjustIframeByContentSize(this.adSlot);

		utils.logger(Interstitial.getName(), 'init');

		eventService.once(events.BEFORE_PAGE_CHANGE_EVENT, () => {
			document.documentElement.classList.remove('stop-scrolling');
		});
	}
}
