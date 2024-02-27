import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Captify,
	communicationService,
	DiProcess,
	eventsRepository,
	Experian,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	Nielsen,
	PartnerPipeline,
	videoDisplayTakeoverSynchronizer,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2AdsMode implements DiProcess {
	constructor(
		private adEngineStackSetup: AdEngineStackSetup,
		private captify: Captify,
		private experian: Experian,
		private gptSetup: GptSetup,
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
				this.captify,
				this.liveConnect,
				this.experian,
				this.nielsen,
				this.wadRunner,
				this.playerSetup.setOptions({
					dependencies: [this.wadRunner.initialized],
				}),
				this.gptSetup,
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
