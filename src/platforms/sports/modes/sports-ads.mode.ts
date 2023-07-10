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
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
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
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.liveRampPixel,
				this.liveConnect,
				this.bidders,
				this.captify,
				this.wadRunner,
				this.audigent,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.gptSetup,
				this.doubleVerify.setOptions({
					dependencies: [this.gptSetup.initialized],
				}),
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
