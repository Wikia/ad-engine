import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Audigent,
	Captify,
	communicationService,
	DiProcess,
	DoubleVerify,
	eventsRepository,
	IasPublisherOptimization,
	jwPlayerInhibitor,
	LiveConnect,
	LiveRampPixel,
	Nielsen,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(
		private adEngineStackSetup: AdEngineStackSetup,
		private audigent: Audigent,
		private captify: Captify,
		private doubleVerify: DoubleVerify,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private pipeline: PartnerPipeline,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.liveRampPixel,
				this.audigent,
				this.captify,
				this.liveConnect,
				this.iasPublisherOptimization,
				this.nielsen,
				this.wadRunner,
				this.playerSetup.setOptions({
					dependencies: [this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify.setOptions({
					dependencies: [this.gptSetup.initialized],
				}),
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.wadRunner.initialized,
						this.gptSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
					],
					timeout: jwPlayerInhibitor.isRequiredToRun()
						? jwPlayerInhibitor.getDelayTimeoutInMs()
						: null,
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
