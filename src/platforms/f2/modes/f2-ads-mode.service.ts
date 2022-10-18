import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	communicationService,
	eventsRepository,
	iasPublisherOptimization,
	nielsen,
	ServicePipeline,
	liveRampPixel,
	liveConnect,
	userIdentity,
	utils,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, adEngineSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel,
				audigent,
				liveConnect,
				iasPublisherOptimization,
				nielsen,
				wadRunner,
				playerSetup,
				gptSetup,
				adEngineSetup,
			)
			.execute()
			.then(() => {
				utils.logger('DJ', 'Pipeline done');
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
