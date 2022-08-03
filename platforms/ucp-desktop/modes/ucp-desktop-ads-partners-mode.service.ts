import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	eventsRepository,
	eyeota,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	optimera,
	PartnerPipeline,
	prebidNativeProvider,
	silverSurferService,
	stroer,
	taxonomyService,
	adMarketplace,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, playerExperimentSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopAdsPartnersModeService implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		const targeting = context.get('targeting');
		this.pipeline
			.add(
				playerExperimentSetup,
				bidders,
				liveConnect,
				facebookPixel,
				taxonomyService,
				optimera,
				silverSurferService,
				wadRunner,
				audigent,
				eyeota,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				stroer,
				identityHub,
				nielsen.setMetadata({
					type: 'static',
					assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
					section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
				}),
				adMarketplace,
				prebidNativeProvider,
				playerSetup.setOptions({
					dependencies: [
						bidders.initialized,
						optimera.initialized,
						taxonomyService.initialized,
						silverSurferService.initialized,
						wadRunner.initialized,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
