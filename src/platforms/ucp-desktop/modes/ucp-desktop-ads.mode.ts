import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	A9Runner,
	Anyclip,
	Audigent,
	Bidders,
	BrandMetrics,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DoubleVerify,
	DurationMedia,
	eventsRepository,
	Eyeota,
	IasPublisherOptimization,
	jwPlayerInhibitor,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	Nielsen,
	OpenWeb,
	PartnerPipeline,
	PrebidNativeProvider,
	PrebidRunner,
	Stroer,
	System1,
	Wunderkind,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private a9Runner: A9Runner,
		private adEngineStackSetup: AdEngineStackSetup,
		private anyclip: Anyclip,
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
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private openWeb: OpenWeb,
		private playerSetup: PlayerSetup,
		private prebidRunner: PrebidRunner,
		private prebidNativeProvider: PrebidNativeProvider,
		private stroer: Stroer,
		private system1: System1,
		private wadRunner: WadRunner,
		private wunderkind: Wunderkind,
		private lotame: Lotame,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.lotame,
				this.liveRampPixel,
				this.anyclip,
				this.audigent,
				this.a9Runner,
				this.prebidRunner,
				this.bidders.setOptions({
					dependencies: [this.a9Runner.initialized, this.prebidRunner.initialized],
				}),
				this.brandMetrics,
				this.liveConnect,
				this.wadRunner,
				this.eyeota,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				this.captify,
				this.nielsen,
				this.prebidNativeProvider,
				this.wunderkind,
				this.openWeb,
				this.system1,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify.setOptions({
					dependencies: [this.gptSetup.initialized],
				}),
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
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
