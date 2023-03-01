import { GptSetup } from '@platforms/shared';
import {
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private gptSetup: GptSetup) {}

	execute(): void {
		this.pipeline
			.add(this.gptSetup)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
