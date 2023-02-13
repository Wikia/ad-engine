import {
	BaseContextSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	NoAdsMode,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { UcpNoAdsWikiContextSetup } from './setup/wiki-context.setup';

@injectable()
export class UcpNoAdsPlatform {
	constructor(private pipeline: ProcessPipeline) {
		context.get('services.instantConfig.endpoint');
	}

	execute(): void {
		this.pipeline.add(
			UcpNoAdsWikiContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			BaseContextSetup,
			TrackingSetup,
			NoAdsMode,
		);
		this.pipeline.execute();
	}
}
