import { AnyclipPlayerSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Audigent,
	Bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DurationMedia,
	eventsRepository,
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
	UserIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private anyclipPlayerSetup: AnyclipPlayerSetup,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private userIdentity: UserIdentity,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.anyclipPlayerSetup,
				this.bidders,
				this.wadRunner,
				this.userIdentity,
				this.liveRampPixel.setOptions({ dependencies: [this.userIdentity.initialized] }),
				this.liveConnect,
				this.audigent,
				this.confiant,
				this.iasPublisherOptimization,
				this.captify,
				this.durationMedia,
				this.playerSetup,
				this.gptSetup.setOptions({
					dependencies: [this.wadRunner.initialized, this.bidders.initialized],
				}),
			)
			.execute()
			.then(() => {
				// TODO: we could remove Phoenix lines below once we introduce communicationService on the platforms
				if (window?.Phoenix?.Events?.trigger) {
					window.Phoenix.Events.trigger('ads_initialized');
				}

				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
