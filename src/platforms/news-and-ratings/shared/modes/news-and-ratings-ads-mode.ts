import { Injectable } from '@wikia/dependency-injection';
import {
	bidders,
	communicationService,
	confiant,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	liveConnect,
	liveRampPixel,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { gptSetup, wadRunner } from '@platforms/shared';

@Injectable()
export class NewsAndRatingsAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				bidders,
				wadRunner,
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				liveConnect,
				confiant,
				iasPublisherOptimization,
				gptSetup.setOptions({
					dependencies: [wadRunner.initialized, bidders.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
