import {
	communicationService,
	eventsRepository,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class BfaaNewsAndRatingsConfigHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.PARAMS) private params: UapParams) {}

	async onEnter(): Promise<void> {
		if (this.params.newTakeoverConfig) {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);
		}

		universalAdPackage.init(this.params, [], []);
	}
}
