import { Injectable } from '@wikia/dependency-injection';
import {
	audigentDeprecated,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	iasPublisherOptimizationDeprecated,
	nielsenDeprecated,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { wadRunnerDeprecated, playerDeprecatedSetup, gptDeprecatedSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				audigentDeprecated,
				iasPublisherOptimizationDeprecated,
				nielsenDeprecated,
				wadRunnerDeprecated,
				playerDeprecatedSetup.setOptions({
					dependencies: [wadRunnerDeprecated.initialized],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptDeprecatedSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
