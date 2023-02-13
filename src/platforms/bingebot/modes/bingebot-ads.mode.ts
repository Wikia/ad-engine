import { GptSetup } from '@platforms/shared';
import {
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
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
