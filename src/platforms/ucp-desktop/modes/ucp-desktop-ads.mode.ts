import { AdEngineStackSetup, GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Anyclip,
	Ats,
	Audigent,
	Bidders,
	communicationService,
	Confiant,
	Connatix,
	DiProcess,
	DoubleVerify,
	DurationMedia,
	eventsRepository,
	IasPublisherOptimization,
	jwPlayerInhibitor,
	OpenWeb,
	PartnerPipeline,
	PrebidNativeProvider,
	Stroer,
	System1,
	utils,
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
		private confiant: Confiant,
		private connatix: Connatix,
		private doubleVerify: DoubleVerify,
		private durationMedia: DurationMedia,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private openWeb: OpenWeb,
		private playerSetup: PlayerSetup,
		private prebidNativeProvider: PrebidNativeProvider,
		private stroer: Stroer,
		private system1: System1,
		private wadRunner: WadRunner,
		private wunderkind: Wunderkind,
	) {}

	execute(): void {
		utils.logger('partners-pipeline', 'starting');
		this.pipeline
			.add(
				this.anyclip,
				this.ats,
				this.audigent,
				this.bidders,
				this.connatix,
				this.wadRunner,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				this.prebidNativeProvider,
				this.wunderkind,
				this.openWeb,
				this.system1,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify,
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
				utils.logger('partners-pipeline', 'finished');
			});
	}
}
