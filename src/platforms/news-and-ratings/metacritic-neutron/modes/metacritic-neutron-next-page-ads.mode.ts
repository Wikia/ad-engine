import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { PlayerSetup, WadRunner } from '@platforms/shared';
import { Bidders } from '@wikia/ad-bidders';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticNeutronNextPageAdsMode implements DiProcess {
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
