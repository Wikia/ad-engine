import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { GptSetup } from '@platforms/shared';
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
