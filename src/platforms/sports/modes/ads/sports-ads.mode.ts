import { gptSetup, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DurationMedia,
	eventsRepository,
	iasPublisherOptimization,
	liveConnect,
	liveRampPixel,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
	) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({
					dependencies: [userIdentity.initialized],
				}),
				liveConnect,
				bidders,
				this.captify,
				wadRunner,
				audigent,
				iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
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
