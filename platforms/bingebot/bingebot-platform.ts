import { bootstrapAndGetConsent } from '@platforms/shared';
import { parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { BingeBotIocSetup } from './bingebot-ioc-setup';

@Injectable()
export class BingeBotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(parallel(BingeBotIocSetup), () => bootstrapAndGetConsent());

		this.pipeline.execute();
	}
}
