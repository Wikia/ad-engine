import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Ats,
	Audigent,
	Bidders,
	BrandMetrics,
	Captify,
	communicationService,
	Confiant,
	context,
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
		private brandMetrics: BrandMetrics,
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
		private identitySetup: IdentitySetup,
		private coppaSetup: CoppaSetup,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.identitySetup.setOptions({
					dependencies: [this.coppaSetup.initialized],
					timeout: context.get('options.coppaTimeout'),
				}),
				this.coppaSetup.setOptions({
					timeout: context.get('options.coppaTimeout'),
				}),
				this.liveRampPixel.setOptions({
					dependencies: [this.coppaSetup.initialized],
					timeout: context.get('options.coppaTimeout'),
				}),
				this.anyclip,
				this.ats,
				this.audigent.setOptions({
					dependencies: [this.coppaSetup.initialized],
					timeout: context.get('options.coppaTimeout'),
				}),
				this.bidders,
				this.brandMetrics,
				this.liveConnect,
				this.liveConnect.setOptions({
					dependencies: [this.coppaSetup.initialized],
					timeout: context.get('options.coppaTimeout'),
				}),
				this.wadRunner,
				this.eyeota.setOptions({
					dependencies: [this.coppaSetup.initialized],
					timeout: context.get('options.coppaTimeout'),
				}),
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				this.identityHub,
				this.captify,
				this.nielsen,
				this.prebidNativeProvider,
				this.wunderkind,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify.setOptions({
					dependencies: [this.gptSetup.initialized],
				}),
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.coppaSetup.initialized,
						this.identitySetup.initialized,
						this.bidders.initialized,
						this.wadRunner.initialized,
						this.gptSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
					],
					timeout: jwPlayerInhibitor.isRequiredToRun()
						? jwPlayerInhibitor.getDelayTimeoutInMs()
						: context.get('options.coppaTimeout'),
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
