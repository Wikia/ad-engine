import { AdSlot } from '../models';
import { context, PrebidWrapper } from '../services';
import { IframeBuilder, logger } from '../utils';
import { Provider } from './provider';

const logGroup = 'prebidium-provider';

export class PrebidiumProvider implements Provider {
	private pbjs = PrebidWrapper.make();
	private iframeBuilder = new IframeBuilder();

	async fillIn(adSlot: AdSlot): Promise<void> {
		const doc = this.getIframeDoc(adSlot);
		const adId = this.getAdId(adSlot);

		await this.pbjs.renderAd(doc, adId);
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
