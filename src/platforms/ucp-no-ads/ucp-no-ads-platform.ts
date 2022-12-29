import {
	BaseContextSetup,
	InstantConfigSetup,
	NoAdsMode,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { Bootstrap, context, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@Injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {
		context.get('services.instantConfig.endpoint');
	}

	execute(): void {
		this.pipeline.add(
			UcpNoAdsWikiContextSetup,
			parallel(InstantConfigSetup, () => Bootstrap.getConsent()),
			TrackingParametersSetup,
			BaseContextSetup,
			TrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
