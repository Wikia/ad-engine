import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Ats,
	Audigent,
	Bidders,
	Captify,
	communicationService,
	Confiant,
	CoppaSetup,
	DiProcess,
	DoubleVerify,
	DurationMedia,
	eventsRepository,
	Eyeota,
	IasPublisherOptimization,
	IdentityHub,
	IdentitySetup,
	jwPlayerInhibitor,
	LiveConnect,
	LiveRampPixel,
	Nielsen,
	PartnerPipeline,
	PrebidNativeProvider,
	Stroer,
	Wunderkind,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private adEngineStackSetup: AdEngineStackSetup,
		private anyclip: Anyclip,
		private ats: Ats,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private doubleVerify: DoubleVerify,
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
		private wunderkind: Wunderkind,
		private coppaSetup: CoppaSetup,
		private identitySetup: IdentitySetup,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.liveRampPixel.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.anyclip,
				this.ats.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.audigent.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.bidders,
				this.liveConnect.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.wadRunner,
				this.eyeota.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.iasPublisherOptimization.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.confiant,
				this.durationMedia,
				this.stroer,
				this.identityHub.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.captify.setOptions({
					dependencies: [this.coppaSetup.initialized],
				}),
				this.nielsen,
				this.prebidNativeProvider,
				this.wunderkind,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify.setOptions({
					dependencies: [this.gptSetup.initialized, this.coppaSetup.initialized],
				}),
				this.identitySetup,
				this.coppaSetup,
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
						this.wadRunner.initialized,
						this.gptSetup.initialized,
						this.coppaSetup.initialized,
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
