import { adEngineSetup, gptSetup, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	durationMedia,
	eventsRepository,
	iasPublisherOptimization,
	liveConnect,
	ServicePipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsMode {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveConnect,
				bidders,
				wadRunner,
				audigent,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				gptSetup,
				adEngineSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
