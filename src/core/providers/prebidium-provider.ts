import {
	BiddersEventPayload,
	communicationService,
	eventsRepository,
	ofType,
} from '@ad-engine/communication';
import { filter, take } from 'rxjs/operators';
import { AdSlot } from '../models';
import { context, pbjsFactory } from '../services';
import { IframeBuilder, logger } from '../utils';
import { Provider } from './provider';

const logGroup = 'prebidium-provider';

export class PrebidiumProvider implements Provider {
	private iframeBuilder = new IframeBuilder();

	async fillIn(adSlot: AdSlot): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.BIDDERS_BIDDING_DONE)),
				filter(
					(action: BiddersEventPayload) =>
						action.provider === 'prebid' && action.slotName === adSlot.getSlotName(),
				),
				take(1),
			)
			.subscribe(() => {
				const doc = this.getIframeDoc(adSlot);
				const adId = this.getAdId(adSlot);

				if (doc && adId) {
					pbjs.renderAd(doc, adId);
					adSlot.getElement()?.classList?.remove('hide');
					adSlot.success();
					logger(logGroup, adSlot.getSlotName(), 'slot added');
				}
			});
	}

	private getIframeDoc(adSlot: AdSlot): Document {
		const iframe = this.iframeBuilder.create(adSlot.getElement());

		return iframe.contentWindow.document;
	}

	private getAdId(adSlot: AdSlot): string {
		return context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);
	}
}
