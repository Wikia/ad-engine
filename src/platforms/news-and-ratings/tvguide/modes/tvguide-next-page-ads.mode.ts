import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
	utils,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class TvGuideNextPageAdsMode implements DiProcess {
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
					utils.logger('SPA', 'pipeline refreshed');
					communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
