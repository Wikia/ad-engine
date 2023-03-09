import { GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Audigent,
	Captify,
	communicationService,
	context,
	DiProcess,
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
		private pipeline: PartnerPipeline,
		private audigent: Audigent,
		private captify: Captify,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
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
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				this.gptSetup.setOptions({
					dependencies: [
						this.playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						this.iasPublisherOptimization.IASReady,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
