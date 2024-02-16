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
	Audigent,
	communicationService,
	Confiant,
	Connatix,
	DiProcess,
	DoubleVerify,
	eventsRepository,
	IasPublisherOptimization,
	PartnerPipeline,
	utils,
	videoDisplayTakeoverSynchronizer,
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
		private confiant: Confiant,
		private connatix: Connatix,
		private doubleVerify: DoubleVerify,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private jwpStrategyRules: JwpStrategyRulesSetup,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		utils.logger('partners-pipeline', 'starting');
		this.pipeline
			.add(
				this.jwpStrategyRules,
				this.anyclip,
				this.ats,
				this.audigent,
				this.connatix,
				this.wadRunner,
				this.iasPublisherOptimization,
				this.confiant,
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
				utils.logger('partners-pipeline', 'finished');
			});
	}
}
