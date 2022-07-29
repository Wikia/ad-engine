import { Injectable } from '@wikia/dependency-injection';
import { communicationService, context, DiProcess, PartnerPipeline } from '@wikia/ad-engine';
import {
	silverSurferSetup,
	biddersSetup,
	liveConnectSetup,
	facebookPixelSetup,
	taxonomySetup,
	optimeraSetup,
	wadRunnerSetup,
	audigentSetup,
	eyeotaSetup,
	iasPublisherOptimizationSetup,
	confiantSetup,
	durationMediaSetup,
	stroerSetup,
	identityHubSetup,
	nielsenSetup,
	adsMarketplaceSetup,
	prebidNativeProviderSetup,
	playerSetup,
	gptSetup,
} from '../../shared/ads-partners-setup';

@Injectable()
export class AdsPartnersSetup implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		const targeting = context.get('targeting');
		this.pipeline
			.add(
				biddersSetup,
				liveConnectSetup,
				facebookPixelSetup,
				taxonomySetup,
				optimeraSetup,
				silverSurferSetup,
				wadRunnerSetup,
				audigentSetup,
				eyeotaSetup,
				iasPublisherOptimizationSetup,
				confiantSetup,
				durationMediaSetup,
				stroerSetup,
				identityHubSetup,
				nielsenSetup.setMetadata({
					type: 'static',
					assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
					section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
				}),
				adsMarketplaceSetup,
				prebidNativeProviderSetup,
				playerSetup.setOptions({
					dependencies: [
						biddersSetup.initialized,
						optimeraSetup.initialized,
						taxonomySetup.initialized,
						silverSurferSetup.initialized,
						wadRunnerSetup.initialized,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup,
			)
			.execute([])
			.then((servicesStatus) => Promise.all(servicesStatus))
			.then(() => {
				communicationService.emit({
					name: 'Partners ready',
				});
			});
	}
}
