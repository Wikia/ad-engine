import { PlayerSetup, WadRunner } from '@platforms/shared';
import {
	A9Runner,
	Anyclip,
	Bidders,
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
	PrebidRunner,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideNextPageAdsMode implements DiProcess {
	constructor(
		private a9Runner: A9Runner,
		private anyclip: Anyclip,
		private pipeline: PartnerPipeline,
		private bidders: Bidders,
		private playerSetup: PlayerSetup,
		private prebidRunner: PrebidRunner,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.bidders.resetInitialized();
		this.a9Runner.resetInitialized();
		this.prebidRunner.resetInitialized();
		this.anyclip.reset();
		this.pipeline
			.add(
				this.anyclip,
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
					utils.logger('SPA', 'pipeline refreshed');
					communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				});
			});
	}
}
