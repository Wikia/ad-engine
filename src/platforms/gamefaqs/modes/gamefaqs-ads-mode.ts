import { Injectable } from '@wikia/dependency-injection';
import {
	bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { gptSetup, wadRunner } from '@platforms/shared';

@Injectable()
export class GamefaqsAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				bidders,
				wadRunner,
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
