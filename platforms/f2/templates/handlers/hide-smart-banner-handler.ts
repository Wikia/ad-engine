import { eventService, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { action } from 'ts-action';

const hideSmartBanner = action('[AdEngine F2 Templates] hide smart banner');

@Injectable({ autobind: false })
export class HideSmartBannerHandler implements TemplateStateHandler {
	async onEnter(): Promise<void> {
		eventService.communicator.dispatch(hideSmartBanner());
	}

	async onLeave(): Promise<void> {}
}
