import { bootstrapAndGetConsent } from '@platforms/shared';
import { ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsMode } from './no-ads-mode';

@Injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(() => bootstrapAndGetConsent(), NoAdsMode);
		this.pipeline.execute();
	}
}
