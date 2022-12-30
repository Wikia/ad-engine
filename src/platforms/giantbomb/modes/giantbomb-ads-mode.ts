import { gptSetup } from '@platforms/shared';
import {
	bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	liveConnect,
	liveRampPixel,
	PartnerPipeline,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GiantbombAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				bidders,
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				liveConnect,
				gptSetup.setOptions({
					dependencies: [bidders.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
