import { decorate } from 'core-decorators';
import { AdSlot } from '../models';
import { context } from '../services';
import { IframeBuilder, logger } from '../utils';
import { Provider } from './provider';

const logGroup = 'prebidium-provider';

// TODO: ADEN-8075
//  Duplicate from ad-bidders/prebid/index.js
//  Perhaps create PBJS wrapper, or at least place to share this kind of functions
function postponeExecutionUntilPbjsLoads(method: (...args: any[]) => void) {
	return function (...args: any[]) {
		return window.pbjs.que.push(() => method.apply(this, args));
	};
}

export class PrebidiumProvider implements Provider {
	/** @private */
	iframeBuilder = new IframeBuilder();

	@decorate(postponeExecutionUntilPbjsLoads)
	fillIn(adSlot: AdSlot): void {
		const doc = this.getIframeDoc(adSlot);
		const adId = this.getAdId(adSlot);

		window.pbjs.renderAd(doc, adId);
		logger(logGroup, adSlot.getSlotName(), 'slot added');
	}

	private getIframeDoc(adSlot: AdSlot): Document {
		const iframe = this.iframeBuilder.create(adSlot);

		return iframe.contentWindow.document;
	}

	private getAdId(adSlot: AdSlot): string {
		return context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);
	}
}
