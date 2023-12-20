import { communicationService, eventsRepository } from '@ad-engine/communication';
import { logger } from './logger';
import { ScriptLoader } from './script-loader';

class TimedPartnerScriptLoader extends ScriptLoader {
	async loadScriptWithStatus(
		src: string,
		partnerName: string,
		isAsyncOrDeferOtherwise = true,
		node: HTMLElement | string = null,
		parameters: Record<string, string> = {},
		datasets: Partial<DOMStringMap> = {},
	): Promise<Event> {
		logger(partnerName, 'loading');
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: partnerName + '_started',
		});

		const event = await super.loadScript(src, isAsyncOrDeferOtherwise, node, parameters, datasets);
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: partnerName + '_loaded',
		});

		logger(partnerName, 'ready');
		return event;
	}
}

export const timedPartnerScriptLoader = new TimedPartnerScriptLoader();
