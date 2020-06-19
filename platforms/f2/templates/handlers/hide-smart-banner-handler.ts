import { communicationService, globalAction, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const hideSmartBanner = globalAction('[AdEngine F2 Templates] hide smart banner');

@Injectable({ autobind: false })
export class HideSmartBannerHandler implements TemplateStateHandler {
	async onEnter(): Promise<void> {
		communicationService.dispatch(hideSmartBanner());
	}

	async onLeave(): Promise<void> {}
}
