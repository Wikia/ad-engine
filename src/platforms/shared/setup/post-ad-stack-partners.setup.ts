import { communicationService } from '@ad-engine/communication';
import { AdSlotEvent } from '@ad-engine/core';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import {
	BrandMetrics,
	Captify,
	Experian,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	Nielsen,
} from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class PostAdStackPartnersSetup implements DiProcess {
	private firstCallSlotName = 'top_leaderboard';
	private safeTimeout = 5000;
	private fired = false;
	private logGroup = 'ad-stack-partners';

	constructor(
		private pipeline: PartnerPipeline,
		private brandMetrics: BrandMetrics,
		private captify: Captify,
		private experian: Experian,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private lotame: Lotame,
		private liveConnect: LiveConnect,
	) {}

	execute(): void {
		logger(this.logGroup, 'waiting ...');
		setTimeout(() => {
			this.pipelineExecute();
		}, this.safeTimeout);
		communicationService.onSlotEvent(
			AdSlotEvent.SLOT_RENDERED_EVENT,
			() => {
				logger(this.logGroup, 'starting');
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
				this.experian,
				this.captify,
				this.nielsen,
			)
			.execute()
			.then(() => {
				logger(this.logGroup, 'finished');
			});
	}
}
