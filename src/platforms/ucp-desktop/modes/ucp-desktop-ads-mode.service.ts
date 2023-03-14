import { GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Ats,
	Audigent,
	Bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DurationMedia,
	eventsRepository,
	Eyeota,
	IasPublisherOptimization,
	IdentityHub,
	jwPlayerInhibitor,
	LiveConnect,
	LiveRampPixel,
	Nielsen,
	PartnerPipeline,
	PrebidNativeProvider,
	Stroer,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private anyclip: Anyclip,
		private ats: Ats,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
		private eyeota: Eyeota,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private identityHub: IdentityHub,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private playerSetup: PlayerSetup,
		private prebidNativeProvider: PrebidNativeProvider,
		private stroer: Stroer,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.liveRampPixel,
				this.anyclip,
				this.ats,
				this.audigent,
				this.bidders,
				this.liveConnect,
				this.wadRunner,
				this.eyeota,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				this.identityHub,
				this.captify,
				this.nielsen,
				this.prebidNativeProvider,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup.setOptions({
					dependencies: [
						this.playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						this.iasPublisherOptimization.IASReady,
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
