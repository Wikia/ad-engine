import { bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
import { context, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsMode } from './no-ads-mode';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@Injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {
		context.get('services.instantConfig.endpoint');
	}

	execute(): void {
		this.pipeline.add(
			UcpNoAdsWikiContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
