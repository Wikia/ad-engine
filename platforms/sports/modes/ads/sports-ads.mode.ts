import { gptSetup, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	DiProcess,
	durationMedia,
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
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({
					dependencies: [userIdentity.initialized],
				}),
				liveConnect,
				bidders,
				wadRunner,
				audigent,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				gptSetup.setOptions({
					dependencies: [userIdentity.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
