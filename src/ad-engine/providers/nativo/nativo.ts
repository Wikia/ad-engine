import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';

import { AdSlot } from '../../models';
import { Context, slotService } from '../../services';
import { scriptLoader, logger } from '../../utils';

const logGroup = 'nativo';
const NATIVO_LIBRARY_URL = '//s.ntv.io/serve/load.js';

export class Nativo {
	static INCONTENT_AD_SLOT_NAME = 'ntv_ad';
	static FEED_AD_SLOT_NAME = 'ntv_feed_ad';

	private static AD_SLOT_MAP = {
		1142863: Nativo.INCONTENT_AD_SLOT_NAME,
		1142668: Nativo.FEED_AD_SLOT_NAME,
		1142669: Nativo.FEED_AD_SLOT_NAME,
	};

	constructor(protected context: Context) {}

	isEnabled() {
		const isEnabled =
			this.context.get('services.nativo.enabled') && this.context.get('wiki.opts.enableNativeAds');

		logger(logGroup, 'Is Nativo enabled?', isEnabled);

		return isEnabled;
	}

	load() {
		logger(logGroup, 'Loading Nativo API...');

		scriptLoader
			.loadScript(NATIVO_LIBRARY_URL, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				logger(logGroup, 'Nativo API loaded.');
				this.watchNtvEvents();
				this.sendNativoLoadStatus(AdSlot.SLOT_ADDED_EVENT);
			});
	}

	scrollTriggerCallback(action: UapLoadStatus, slotName: string) {
		if (action.isLoaded || action.adProduct === 'ruap') {
			logger(logGroup, "UAP or UAP:Roadblock on page - don't display Nativo");
			return;
		}

		this.context.push('state.adStack', { id: slotName });
	}

	sendNativoLoadStatus(status: string, event?: any): void {
		const adLocation = event?.data[0].adLocation || '';
		const payload = {
			event: status,
			adSlotName: adLocation,
			payload: {
				adLocation: adLocation,
				provider: 'nativo',
			},
		};

		communicationService.dispatch(
			communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)(payload),
		);
	}

	private watchNtvEvents(): void {
		window.ntv.Events?.PubSub?.subscribe('noad', (e: NativoNoAdEvent) => {
			const slotName = Nativo.AD_SLOT_MAP[e.data[0].id];
			this.handleNtvNativeEvent(e, slotName, AdSlot.STATUS_COLLAPSE); // init or collapse
		});

		window.ntv.Events?.PubSub?.subscribe('adRenderingComplete', (e: NativoCompleteEvent) => {
			const slotName = Nativo.AD_SLOT_MAP[e.data.placement];
			this.handleNtvNativeEvent(e, slotName, AdSlot.STATUS_SUCCESS);
		});
	}

	private handleNtvNativeEvent(e, slotName: string, adStatus: string) {
		const slot = slotService.get(slotName);

		logger(logGroup, 'Nativo native event fired', e, adStatus, slotName, slot);

		if (!slot || slot.getSlotName() !== slotName) return;

		if (slot.getStatus() !== adStatus) {
			slot.setStatus(adStatus);
		} else {
			logger(logGroup, 'Slot status already tracked', slot.getSlotName(), adStatus);
		}
	}
}
