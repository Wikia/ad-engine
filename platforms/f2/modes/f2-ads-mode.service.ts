import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	communicationService,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	nielsen,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(audigent, iasPublisherOptimization, nielsen, wadRunner, playerSetup, gptSetup)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
