import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	communicationService,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	liveConnect,
	liveRampPixel,
	nielsen,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { wadRunner, gptSetup } from '@platforms/shared';

@Injectable()
export class FanCentralAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({
					dependencies: [userIdentity.initialized],
				}),
				audigent,
				liveConnect,
				iasPublisherOptimization,
				nielsen,
				wadRunner,
				gptSetup.setOptions({
					dependencies: [userIdentity.initialized, iasPublisherOptimization.IASReady],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
