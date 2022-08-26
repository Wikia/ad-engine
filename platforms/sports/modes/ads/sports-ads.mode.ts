import { Injectable } from '@wikia/dependency-injection';
import {
	audigentDeprecated,
	bidders,
	communicationService,
	confiantDeprecated,
	DiProcess,
	durationMediaDeprecated,
	eventsRepository,
	iasPublisherOptimizationDeprecated,
	PartnerPipeline,
	userIdentityDeprecated,
} from '@wikia/ad-engine';
import { wadRunnerDeprecated, gptDeprecatedSetup } from '@platforms/shared';

@Injectable()
export class SportsAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentityDeprecated,
				bidders,
				wadRunnerDeprecated,
				audigentDeprecated,
				iasPublisherOptimizationDeprecated,
				confiantDeprecated,
				durationMediaDeprecated,
				gptDeprecatedSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
