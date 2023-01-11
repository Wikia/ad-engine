import { Injectable } from '@wikia/dependency-injection';
import {
	bidders,
	captify,
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
import { gptSetup, wadRunner } from '@platforms/shared';
import { playerSetup } from '../../../shared';

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
				captify,
				durationMedia,
				playerSetup,
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
