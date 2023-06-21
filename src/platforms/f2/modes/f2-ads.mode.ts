import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Audigent,
	Captify,
	communicationService,
	DiProcess,
	DoubleVerify,
	eventsRepository,
	IasPublisherOptimization,
	IdentitySetup,
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
		private pipeline: PartnerPipeline,
		private audigent: Audigent,
		private captify: Captify,
		private doubleVerify: DoubleVerify,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private identitySetup: IdentitySetup,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
		private adEngineStackSetup: AdEngineStackSetup,
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
				this.identitySetup,
				this.playerSetup,
				this.gptSetup.setOptions({
					timeout: 10000,
				}),
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.wadRunner.initialized,
						this.playerSetup.initialized,
						this.gptSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						this.iasPublisherOptimization.IASReady,
					],
					timeout: jwPlayerInhibitor.isRequiredToRun()
						? jwPlayerInhibitor.getDelayTimeoutInMs()
						: null,
				}),
				this.doubleVerify.setOptions({
					dependencies: [this.adEngineStackSetup.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
