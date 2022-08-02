import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
} from '@wikia/ad-engine';
import {
	silverSurferSetup,
	facebookPixelSetup,
	taxonomySetup,
	audigentSetup,
	iasPublisherOptimizationSetup,
	confiantSetup,
	stroerSetup,
	identityHubSetup,
	nielsenSetup,
	gptSetup,
	playerSetup,
} from '../../shared/ads-partners-setup';

@Injectable()
export class UcpMobileLighterAdsPartners implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		const targeting = context.get('targeting');
		this.pipeline
			.add(
				taxonomySetup,
				silverSurferSetup,
				facebookPixelSetup,
				audigentSetup,
				iasPublisherOptimizationSetup,
				confiantSetup,
				stroerSetup,
				nielsenSetup.setMetadata({
					type: 'static',
					assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
					section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
				}),
				identityHubSetup,
				playerSetup.setOptions({
					dependencies: [taxonomySetup.initialized, silverSurferSetup.initialized],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				gptSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}
