import { communicationService, eventsRepository, TemplateStateHandler } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class HideSmartBannerHandler implements TemplateStateHandler {
	async onEnter(): Promise<void> {
		communicationService.emit(eventsRepository.F2_HIDE_SMART_BANNER);
	}
}
