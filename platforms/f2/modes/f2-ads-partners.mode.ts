import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	iasPublisherOptimization,
	nielsen,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup } from '@platforms/shared';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		const targeting = context.get('targeting');
		this.pipeline
			.add(
				audigent,
				iasPublisherOptimization,
				nielsen.setMetadata({
					type: 'static',
					assetid: `fandom.com/news_and_stories/${targeting.s1}/${targeting.post_id}`,
					section: `FANDOM NEWS AND STORIES NETWORK`,
				}),
				wadRunner,
				playerSetup.setOptions({
					dependencies: [wadRunner.initialized],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
