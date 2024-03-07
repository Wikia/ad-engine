import {
	BiddersEventPayload,
	communicationService,
	eventsRepository,
} from '@ad-engine/communication';
import { AdSlot } from '../models';
import { pbjsFactory, targetingService } from '../services';
import { IframeBuilder, logger } from '../utils';
import { Provider } from './provider';

const logGroup = 'prebidium-provider';

export class PrebidiumProvider implements Provider {
	private iframeBuilder = new IframeBuilder();

	async fillIn(adSlot: AdSlot): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		communicationService.on(
			communicationService.getGlobalAction(eventsRepository.BIDDERS_BIDDING_DONE),
			(action: BiddersEventPayload) => {
				if (action.provider === 'prebid' && action.slotName === adSlot.getSlotName()) {
					const doc = this.getIframeDoc(adSlot);
					const adId = this.getAdId(adSlot);

					if (doc && adId) {
						pbjs.renderAd(doc, adId);
						adSlot.getElement()?.classList?.remove(AdSlot.HIDDEN_AD_CLASS);
						adSlot.success();
						logger(logGroup, adSlot.getSlotName(), 'slot added');
					}
				}
			},
		);
	}

	private getIframeDoc(adSlot: AdSlot): Document {
		const iframe = this.iframeBuilder.create(adSlot.getElement());

		return iframe.contentWindow.document;
	}

	private getAdId(adSlot: AdSlot): string {
		return targetingService.get('hb_adid', adSlot.getSlotName());
	}
}
