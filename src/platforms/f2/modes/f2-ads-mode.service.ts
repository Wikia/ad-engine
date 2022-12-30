import { gptSetup, playerSetup, wadRunner } from '@platforms/shared';
import {
	audigent,
	Captify,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	jwPlayerInhibitor,
	liveConnect,
	liveRampPixel,
	Nielsen,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private captify: Captify,
		private nielsen: Nielsen,
	) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({
					dependencies: [userIdentity.initialized],
				}),
				audigent,
				this.captify,
				liveConnect,
				iasPublisherOptimization,
				this.nielsen,
				wadRunner,
				playerSetup.setOptions({
					dependencies: [wadRunner.initialized],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [
						userIdentity.initialized,
						playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						iasPublisherOptimization.IASReady,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
