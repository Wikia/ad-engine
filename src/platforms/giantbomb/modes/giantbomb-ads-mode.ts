import { Injectable } from '@wikia/dependency-injection';
import {
	bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { gptSetup } from '@platforms/shared';

@Injectable()
export class GiantbombAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				bidders,
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
