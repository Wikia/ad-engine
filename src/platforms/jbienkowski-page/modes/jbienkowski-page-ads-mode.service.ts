import { GptSetup } from '@platforms/shared';
import {
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
	UserIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class JbienkowskiPageAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private gptSetup: GptSetup,
		private userIdentity: UserIdentity,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.userIdentity,
				this.gptSetup.setOptions({
					dependencies: [this.userIdentity.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
