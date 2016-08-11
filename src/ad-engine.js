'use strict';

import {makeLazyQueue} from './utils/lazy-queue';
import AdSlot from './models/ad-slot';
import Context from './services/context-service';
import FloatingAd from './templates/floating-ad';
import Interstitial from './templates/interstitial';
import GptProvider from './providers/gpt-provider';
import ScrollListener from './listeners/scroll-listener';
import SlotService from './services/slot-service';
import TemplateService from './services/template-service';

export default class AdEngine {
	/**
	 * Create new instance
	 */
	constructor() {
		this.adStack = Context.get('state.adStack');

		window.ads = window.ads || {};
		window.ads.runtime = window.ads.runtime || {};

		TemplateService.register('floating-ad', FloatingAd);
		TemplateService.register('interstitial', Interstitial);
	}

	init() {
		let provider = new GptProvider();

		makeLazyQueue(this.adStack, (ad) => {
			this.fillInUsingProvider(ad, provider);

			if (this.adStack.length === 0) {
				provider.flush();
			}
		});
		this.adStack.start();

		ScrollListener.init();

		if (Context.get('events.pushOnScroll')) {
			Context.get('events.pushOnScroll.ids').forEach((id) => {
				ScrollListener.addSlot(this.adStack, id, Context.get('events.pushOnScroll.threshold'));
			});
		}
	}

	fillInUsingProvider(ad, provider) {
		const adSlot = new AdSlot(ad);

		if (adSlot.shouldLoad()) {
			SlotService.add(adSlot);
			provider.fillIn(adSlot);
		}
	};
}
