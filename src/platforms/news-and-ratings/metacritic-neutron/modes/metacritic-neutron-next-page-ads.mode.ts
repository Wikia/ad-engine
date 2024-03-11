import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Bidders,
	communicationService,
	DiProcess,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AD_ENGINE_PARTNERS_READY } from "../../../../communication/events/events-ad-engine";

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
					communicationService.emit(AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
