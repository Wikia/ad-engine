import { AdEngineStackSetup, GptSetup, WadRunner } from '@platforms/shared';
import {
	Audigent,
	Bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DoubleVerify,
	DurationMedia,
	eventsRepository,
	Experian,
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private adEngineStackSetup: AdEngineStackSetup,
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
		private wadRunner: WadRunner,
		private lotame: Lotame,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.lotame,
				this.liveRampPixel,
				this.liveConnect,
				this.experian,
				this.bidders,
				this.captify,
				this.wadRunner,
				this.audigent,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
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
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
