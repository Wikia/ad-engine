import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	A9Runner,
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
	PrebidRunner,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticNeutronNextPageAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private a9Runner: A9Runner,
		private bidders: Bidders,
		private playerSetup: PlayerSetup,
		private prebidRunner: PrebidRunner,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.bidders.resetInitialized();
		this.a9Runner.resetInitialized();
		this.prebidRunner.resetInitialized();
		this.pipeline
			.add(
				this.a9Runner,
				this.prebidRunner,
				this.bidders.setOptions({
					dependencies: [this.a9Runner.initialized, this.prebidRunner.initialized],
				}),
				this.wadRunner,
				this.playerSetup,
			)
			.execute()
			.then(() => {
				this.bidders.initialized.then(() => {
					communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
