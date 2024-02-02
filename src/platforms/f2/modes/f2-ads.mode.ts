import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import { videoDisplayTakeoverSynchronizer } from '@wikia/ad-products';
import {
	Audigent,
	Captify,
	DoubleVerify,
	Experian,
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	Nielsen,
} from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(
		private adEngineStackSetup: AdEngineStackSetup,
		private audigent: Audigent,
		private captify: Captify,
		private doubleVerify: DoubleVerify,
		private experian: Experian,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private pipeline: PartnerPipeline,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
		private lotame: Lotame,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.lotame,
				this.liveRampPixel,
				this.audigent,
				this.captify,
				this.liveConnect,
				this.experian,
				this.iasPublisherOptimization,
				this.nielsen,
				this.wadRunner,
				this.playerSetup.setOptions({
					dependencies: [this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify,
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.wadRunner.initialized,
						this.gptSetup.initialized,
						videoDisplayTakeoverSynchronizer.isRequiredToRun()
							? videoDisplayTakeoverSynchronizer.initialized
							: Promise.resolve(),
					],
					timeout: videoDisplayTakeoverSynchronizer.isRequiredToRun()
						? videoDisplayTakeoverSynchronizer.getDelayTimeoutInMs()
						: null,
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
