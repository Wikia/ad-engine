import { GptSetup, WadRunner } from '@platforms/shared';
import {
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
	UserIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private bidders: Bidders,
		private gptSetup: GptSetup,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private userIdentity: UserIdentity,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.bidders,
				this.wadRunner,
				this.userIdentity,
				this.liveRampPixel.setOptions({ dependencies: [this.userIdentity.initialized] }),
				this.liveConnect,
				this.gptSetup.setOptions({
					dependencies: [this.wadRunner.initialized, this.bidders.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
