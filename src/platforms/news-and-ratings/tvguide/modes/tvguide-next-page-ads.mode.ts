import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import { PlayerSetup, WadRunner } from '@platforms/shared';
import { Bidders } from '@wikia/ad-bidders';
import { Anyclip } from '@wikia/ad-services';
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
			.add(this.anyclip, this.bidders, this.wadRunner, this.playerSetup)
			.execute()
			.then(() => {
				this.bidders.initialized.then(() => {
					logger('SPA', 'pipeline refreshed');
					communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
