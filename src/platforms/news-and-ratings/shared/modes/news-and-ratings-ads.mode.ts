import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Audigent,
	Bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DoubleVerify,
	DurationMedia,
	eventsRepository,
	IasPublisherOptimization,
	IdentitySetup,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private anyclip: Anyclip,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private doubleVerify: DoubleVerify,
		private durationMedia: DurationMedia,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private identitySetup: IdentitySetup,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
		private adEngineStackSetup: AdEngineStackSetup,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.anyclip,
				this.bidders,
				this.wadRunner,
				this.liveRampPixel,
				this.liveConnect,
				this.audigent,
				this.confiant,
				this.iasPublisherOptimization,
				this.captify,
				this.durationMedia,
				this.playerSetup,
				this.identitySetup,
				this.gptSetup.setOptions({
					timeout: 10000,
				}),
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
						this.wadRunner.initialized,
						this.gptSetup.initialized,
					],
				}),
				this.doubleVerify.setOptions({
					dependencies: [this.adEngineStackSetup.initialized],
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
