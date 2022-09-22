import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	communicationService,
	eventsRepository,
	iasPublisherOptimization,
	nielsen,
	ServicePipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, adEngineSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				audigent,
				iasPublisherOptimization,
				nielsen,
				wadRunner,
				playerSetup,
				gptSetup,
				adEngineSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
