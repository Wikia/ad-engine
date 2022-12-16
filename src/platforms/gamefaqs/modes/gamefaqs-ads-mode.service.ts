import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	DiProcess,
	eventsRepository,
	liveConnect,
	PartnerPipeline,
	userIdentity,
	liveRampPixel,
	bidders,
} from '@wikia/ad-engine';
import { gptSetup } from '@platforms/shared';

@Injectable()
export class GamefaqsAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				liveConnect,
				bidders,
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
