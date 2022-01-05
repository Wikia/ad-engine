import { communicationService, eventsRepository, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class HideSmartBannerHandler implements TemplateStateHandler {
	async onEnter(): Promise<void> {
		communicationService.communicate(eventsRepository.F2_HIDE_SMART_BANNER);
	}
}
