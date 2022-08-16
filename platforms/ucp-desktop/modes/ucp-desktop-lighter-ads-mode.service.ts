import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	DiProcess,
	PartnerPipeline,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	nielsen,
	silverSurferService,
	stroer,
	taxonomyService,
	audigent,
	confiant,
	adIdentity,
} from '@wikia/ad-engine';
import { gptSetup, playerSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				adIdentity,
				taxonomyService,
				silverSurferService,
				facebookPixel,
				audigent,
				iasPublisherOptimization,
				confiant,
				stroer,
				nielsen,
				identityHub,
				playerSetup.setOptions({
					dependencies: [taxonomyService.initialized, silverSurferService.initialized],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [adIdentity.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
