import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import { Bidders } from '@wikia/ad-bidders';
import {
	Anyclip,
	Audigent,
	Captify,
	Confiant,
	DoubleVerify,
	DurationMedia,
	Experian,
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	Lotame,
} from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private adEngineStackSetup: AdEngineStackSetup,
		private anyclip: Anyclip,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private doubleVerify: DoubleVerify,
		private durationMedia: DurationMedia,
		private experian: Experian,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
		private lotame: Lotame,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.lotame,
				this.anyclip,
				this.bidders,
				this.wadRunner,
				this.liveRampPixel,
				this.liveConnect,
				this.experian,
				this.audigent,
				this.confiant,
				this.iasPublisherOptimization,
				this.captify,
				this.durationMedia,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify,
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
						this.wadRunner.initialized,
						this.gptSetup.initialized,
					],
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
