import { AnyclipPlayerSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DurationMedia,
	eventsRepository,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuidePageChangeAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private anyclipPlayerSetup: AnyclipPlayerSetup,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.bidders.resetInitialized();
		this.pipeline
			.add(
				this.anyclipPlayerSetup,
				this.bidders,
				this.wadRunner,
				this.liveRampPixel,
				this.liveConnect,
				this.confiant,
				this.captify,
				this.durationMedia,
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
