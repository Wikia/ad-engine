import { Injectable } from '@wikia/dependency-injection';
import {
	adMarketplace,
	ats,
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	PartnerPipeline,
	stroer,
	userIdentity,
} from '@wikia/ad-engine';
import { gptSetup, playerSetup } from '@platforms/shared';

@Injectable()
export class UcpMobileLighterAds implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				ats,
				facebookPixel,
				audigent,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				liveConnect,
				adMarketplace,
				stroer,
				bidders,
				nielsen,
				identityHub,
				playerSetup.setOptions({
					dependencies: [bidders.initialized],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [userIdentity.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
