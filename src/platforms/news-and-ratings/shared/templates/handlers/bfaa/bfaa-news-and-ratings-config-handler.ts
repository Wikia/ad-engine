import {
	communicationService,
	context,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { AD_ENGINE_UAP_NTC_LOADED } from "../../../../../../communication/events/events-ad-engine-uap";

@Injectable({ autobind: false })
export class BfaaNewsAndRatingsConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		if (this.params.newTakeoverConfig) {
			communicationService.emit(AD_ENGINE_UAP_NTC_LOADED);
		}

		universalAdPackage.init(this.params, Object.keys(context.get('slots')), []);
	}
}
