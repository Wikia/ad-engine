import { communicationService, eventsRepository } from '@ad-engine/communication';

import { AdSlot } from '../../models';
import { Context } from '../../services';
import { scriptLoader, logger } from '../../utils';

const logGroup = 'nativo';

export class Nativo {
	constructor(protected context: Context) {}

	isEnabled() {
		const isEnabled =
			this.context.get('services.nativo.enabled') && this.context.get('wiki.opts.enableNativeAds');

		logger(logGroup, 'Is Nativo enabled?', isEnabled);

		return isEnabled;
	}

	load() {
		logger(logGroup, 'Loading Nativo SDK...');
		const NATIVO_LIBRARY_URL = '//s.ntv.io/serve/load.js';

		scriptLoader
			.loadScript(NATIVO_LIBRARY_URL, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				logger(logGroup, 'Nativo SDK loaded.');
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
