import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuidePageChangeAdsObserver implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private bidders: Bidders,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.bidders.resetInitialized();
		this.pipeline
			.add(this.bidders, this.wadRunner, this.playerSetup)
			.execute()
			.then(() => {
				this.bidders.initialized.then(() => {
					communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
