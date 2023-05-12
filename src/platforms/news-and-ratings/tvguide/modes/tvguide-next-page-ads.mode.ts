import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideNextPageAdsMode implements DiProcess {
	constructor(
		private anyclip: Anyclip,
		private pipeline: PartnerPipeline,
		private bidders: Bidders,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.bidders.resetInitialized();
		this.anyclip.reset();
		this.pipeline
			.add(this.anyclip)
			.add(this.bidders, this.wadRunner, this.playerSetup)
			.execute()
			.then(() => {
				this.bidders.initialized.then(() => {
					utils.logger('SPA', 'pipeline refreshed');
					communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
