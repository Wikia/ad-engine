import { communicationService, eventsRepository } from '@ad-engine/communication';

import { AdSlot } from '../../models';
import { context } from '../../services';
import { scriptLoader } from '../../utils';

export class Nativo {
	isEnabled() {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}

	load() {
		const NATIVO_LIBRARY_URL = '//s.ntv.io/serve/load.js';

		scriptLoader
			.loadScript(NATIVO_LIBRARY_URL, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				this.sendNativoLoadStatus(AdSlot.SLOT_ADDED_EVENT);
			});
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
}
