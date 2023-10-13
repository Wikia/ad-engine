import {
	AdSlotEvent,
	BrandMetrics,
	Captify,
	communicationService,
	DiProcess,
	Experian,
	Eyeota,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	Nielsen,
	PartnerPipeline,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpPartnersSetup implements DiProcess {
	private firstCallSlotName = 'top_leaderboard';
	private safeTimeout = 5000;
	private fired = false;
	private logGroup = 'ad-stack-partners';

	constructor(
		private pipeline: PartnerPipeline,
		private brandMetrics: BrandMetrics,
		private captify: Captify,
		private eyeota: Eyeota,
		private experian: Experian,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private lotame: Lotame,
		private liveConnect: LiveConnect,
	) {}

	execute(): void {
		utils.logger(this.logGroup, 'waiting ...');
		setTimeout(() => {
			this.pipelineExecute();
		}, this.safeTimeout);
		communicationService.onSlotEvent(
			AdSlotEvent.SLOT_RENDERED_EVENT,
			() => {
				utils.logger(this.logGroup, 'starting');
				this.pipelineExecute();
			},
			this.firstCallSlotName,
		);
	}

	private pipelineExecute(): void {
		if (this.fired) {
			return;
		}
		this.fired = true;

		this.pipeline
			.add(
				this.lotame,
				this.liveConnect,
				this.liveRampPixel,
				this.brandMetrics,
				this.eyeota,
				this.experian,
				this.captify,
				this.nielsen,
			)
			.execute()
			.then(() => {
				utils.logger(this.logGroup, 'finished');
			});
	}
}
