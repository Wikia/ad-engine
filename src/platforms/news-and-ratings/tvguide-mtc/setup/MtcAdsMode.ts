import { AdEngineStackSetup } from '@platforms/shared';
import { DiProcess, PartnerPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MtcAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private adEngineStackSetup: AdEngineStackSetup) {}

	execute(): void {
		this.pipeline.add(this.adEngineStackSetup).execute();
	}
}
