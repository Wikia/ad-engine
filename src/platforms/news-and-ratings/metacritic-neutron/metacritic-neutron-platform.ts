import { Container, Injectable } from '@wikia/dependency-injection';

import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporter,
	MetricReporterSetup,
	SlotsConfigurationExtender,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
import {
	BiddersStateOverwriteSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsNeutronSetup,
	NewsAndRatingsNeutronHelper,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { MetacriticNeutronNextPageAdsMode } from './modes/metacritic-neutron-next-page-ads.mode';
import { MetacriticNeutronA9ConfigSetup } from './setup/context/a9/metacritic-neutron-a9-config.setup';
// import { MetacriticNeutronPrebidConfigSetup } from './setup/context/prebid/metacritic-neutron-prebid-config.setup';
import { MetacriticNeutronSlotsContextV2Setup } from './setup/context/slots/metacritic-neutron-slots-context-v2.setup';
import { MetacriticNeutronTargetingSetup } from './setup/context/targeting/metacritic-neutron-targeting.setup';
import { MetacriticNeutronSeeMoreButtonClickListenerSetup } from './setup/page-change-observers/metacritic-neutron-see-more-button-click-listener.setup';
import { MetacriticNeutronTemplatesSetup } from './templates/metacritic-neutron-templates.setup';

@Injectable()
export class MetacriticNeutronPlatform {
	constructor(
		private pipeline: ProcessPipeline,
		private spaWatchers: NewsAndRatingsNeutronHelper,
	) {}

	execute(container: Container): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TrackingParametersSetup,
			MetricReporterSetup,
			MetricReporter,
			LoadTimesSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			NewsAndRatingsTargetingSetup,
			MetacriticNeutronTargetingSetup,
			MetacriticNeutronSlotsContextV2Setup,
			SlotsConfigurationExtender,
			NewsAndRatingsDynamicSlotsNeutronSetup,
			// MetacriticNeutronPrebidConfigSetup,
			MetacriticNeutronA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			MetacriticNeutronTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
			MetacriticNeutronSeeMoreButtonClickListenerSetup,
		);

		this.pipeline.execute();
		this.setupSinglePageAppWatchers(container);
	}

	private setupSinglePageAppWatchers(container: Container) {
		this.spaWatchers.setupPageChangedWatcher(
			container,
			NewsAndRatingsBaseContextSetup,
			MetacriticNeutronTargetingSetup,
			NewsAndRatingsTargetingSetup,
			MetacriticNeutronSlotsContextV2Setup,
			MetacriticNeutronNextPageAdsMode,
			MetacriticNeutronSeeMoreButtonClickListenerSetup,
		);
	}
}
