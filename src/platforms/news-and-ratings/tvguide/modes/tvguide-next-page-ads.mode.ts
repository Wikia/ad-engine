import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Bidders,
	communicationService,
	DiProcess,
	PartnerPipeline,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AD_ENGINE_PARTNERS_READY } from "../../../../communication/events/events-ad-engine";

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
					utils.logger('SPA', 'pipeline refreshed');
					communicationService.emit(AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
