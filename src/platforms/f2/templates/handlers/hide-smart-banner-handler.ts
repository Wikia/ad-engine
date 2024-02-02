import { communicationService, eventsRepository } from '@ad-engine/communication';
import { TemplateStateHandler } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class HideSmartBannerHandler implements TemplateStateHandler {
	async onEnter(): Promise<void> {
		communicationService.emit(eventsRepository.F2_HIDE_SMART_BANNER);
	}
}
