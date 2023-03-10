import { GptSetup, PlayerSetup } from '@platforms/shared';
import {
	Ats,
	Audigent,
	Captify,
	communicationService,
	Confiant,
	context,
	DiProcess,
	eventsRepository,
	IasPublisherOptimization,
	IdentityHub,
	IdentitySetup,
	jwPlayerInhibitor,
	LiveConnect,
	LiveRampPixel,
	Nielsen,
	PartnerPipeline,
	Stroer,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private ats: Ats,
		private audigent: Audigent,
		private captify: Captify,
		private confiant: Confiant,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private identityHub: IdentityHub,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private playerSetup: PlayerSetup,
		private stroer: Stroer,
		private identitySetup: IdentitySetup,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.liveRampPixel,
				this.ats,
				this.audigent,
				this.iasPublisherOptimization,
				this.confiant,
				this.liveConnect,
				this.captify,
				this.stroer,
				this.nielsen,
				this.identityHub,
				this.identitySetup,
				this.playerSetup.setOptions({
					dependencies: [],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				this.gptSetup.setOptions({
					dependencies: [
						this.playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						this.iasPublisherOptimization.IASReady,
					],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
