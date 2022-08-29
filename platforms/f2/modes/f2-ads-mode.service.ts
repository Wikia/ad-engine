import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	nielsen,
	PartnerPipeline,
	taxonomyService,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, adEngineSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				audigent,
				iasPublisherOptimization,
				nielsen,
				wadRunner,
				playerSetup,
				bidders,
				taxonomyService,
				gptSetup,
				adEngineSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
