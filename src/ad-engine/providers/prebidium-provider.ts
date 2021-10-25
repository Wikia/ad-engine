import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { filter, take } from 'rxjs/operators';
import { props } from 'ts-action';
import { AdSlot } from '../models';
import { context, pbjsFactory } from '../services';
import { IframeBuilder, logger } from '../utils';
import { Provider } from './provider';

const logGroup = 'prebidium-provider';

export const biddingDone = globalAction(
	'[AdEngine] Bidding done',
	props<{ name: string; state: string }>(),
);

export class PrebidiumProvider implements Provider {
	private iframeBuilder = new IframeBuilder();

	async fillIn(adSlot: AdSlot): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		communicationService.action$
			.pipe(
				ofType(biddingDone),
				filter((action) => action.state === 'prebid' && action.name === adSlot.getSlotName()),
				take(1),
			)
			.subscribe(() => {
				const doc = this.getIframeDoc(adSlot);
				const adId = this.getAdId(adSlot);

				if (doc && adId) {
					pbjs.renderAd(doc, adId);
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
