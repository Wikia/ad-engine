import {
	AdEngineStackSetup,
	GptSetup,
	JwpStrategyRulesSetup,
	PlayerSetup,
	WadRunner,
} from '@platforms/shared';
import {
	Anyclip,
	Ats,
	Bidders,
	communicationService,
	Confiant,
	Connatix,
	DiProcess,
	DurationMedia,
	eventsRepository,
	PartnerPipeline,
	PrebidNativeProvider,
	Stroer,
	System1,
	utils,
	videoDisplayTakeoverSynchronizer,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private adEngineStackSetup: AdEngineStackSetup,
		private anyclip: Anyclip,
		private ats: Ats,
		private bidders: Bidders,
		private confiant: Confiant,
		private connatix: Connatix,
		private durationMedia: DurationMedia,
		private gptSetup: GptSetup,
		private jwpStrategyRules: JwpStrategyRulesSetup,
		private playerSetup: PlayerSetup,
		private prebidNativeProvider: PrebidNativeProvider,
		private stroer: Stroer,
		private system1: System1,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		utils.logger('partners-pipeline', 'starting');
		this.pipeline
			.add(
				this.jwpStrategyRules,
				this.anyclip,
				this.ats,
				this.bidders,
				this.wadRunner,
				this.confiant,
				this.connatix,
				this.durationMedia,
				this.stroer,
				this.system1,
				this.prebidNativeProvider,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
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
				utils.logger('partners-pipeline', 'finished');
			});
	}
}
