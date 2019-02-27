import { decorate } from 'core-decorators';
import { context } from '../services';
import { IframeBuilder, logger } from '../utils';

const logGroup = 'prebidium-provider';

// TODO: ADEN-8075
//  Duplicate from ad-bidders/prebid/index.js
//  Perhaps create PBJS wrapper, or at least place to share this kind of functions
function postponeExecutionUntilPbjsLoads(method) {
	return function (...args) {
		return window.pbjs.que.push(() => method.apply(this, args));
	};
}

export class PrebidiumProvider {
	/** @private */
	iframeBuilder = new IframeBuilder();

	@decorate(postponeExecutionUntilPbjsLoads)
	fillIn(adSlot) {
		const doc = this.getIframeDoc(adSlot);
		const adId = this.getAdId(adSlot);

		window.pbjs.renderAd(doc, adId);
		logger(logGroup, adSlot.getSlotName(), 'slot added');
	}

	/** @private */
	getIframeDoc(adSlot) {
		const iframe = this.iframeBuilder.create(adSlot);

		return iframe.contentWindow.document;
	}

	/** @private */
	getAdId(adSlot) {
		return context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);
	}
}
