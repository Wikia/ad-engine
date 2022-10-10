import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	liveConnect,
	jwPlayerInhibitor,
	liveRampPixel,
	nielsen,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode implements DiProcess {
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
				playerSetup.setOptions({
					dependencies: [wadRunner.initialized],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [
						userIdentity.initialized,
						playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
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
