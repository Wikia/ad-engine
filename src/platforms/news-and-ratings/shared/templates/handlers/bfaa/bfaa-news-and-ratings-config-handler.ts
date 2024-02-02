import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, TEMPLATE, TemplateStateHandler } from '@ad-engine/core';
import { UapParams, universalAdPackage } from '@wikia/ad-products';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class BfaaNewsAndRatingsConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		if (this.params.newTakeoverConfig) {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);
		}

		universalAdPackage.init(this.params, Object.keys(context.get('slots')), []);
	}
}
