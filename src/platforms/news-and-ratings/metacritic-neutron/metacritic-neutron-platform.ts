import { context } from '@ad-engine/core';
import { parallel, ProcessPipeline, sequential } from '@ad-engine/pipeline';
import { client, logVersion } from '@ad-engine/utils';
import {
	BiddersStateSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporterSetup,
	PreloadedLibrariesSetup,
	SlotsConfigurationExtender,
	SlotTrackingSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { IdentitySetup } from '@wikia/ad-services';
import { Container, Injectable } from '@wikia/dependency-injection';
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
import { MetacriticNeutronPrebidConfigSetup } from './setup/context/prebid/metacritic-neutron-prebid-config.setup';
import { MetacriticNeutronSlotsContextSetup } from './setup/context/slots/metacritic-neutron-slots-context.setup';
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
		logVersion();
		context.extend(basicContext);
		context.set('state.isMobile', !client.isDesktop());

		this.pipeline.add(
			async () => await ensureGeoCookie(),
			parallel(
				sequential(InstantConfigSetup, PreloadedLibrariesSetup),
				ConsentManagementPlatformSetup,
			),
			() => context.set('services.anyclip.isApplicable', () => false),
			TrackingParametersSetup,
			MetricReporterSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			IdentitySetup,
			NewsAndRatingsTargetingSetup,
			MetacriticNeutronTargetingSetup,
			LoadTimesSetup,
			MetacriticNeutronSlotsContextSetup,
			SlotsConfigurationExtender,
			NewsAndRatingsDynamicSlotsNeutronSetup,
			MetacriticNeutronPrebidConfigSetup,
			MetacriticNeutronA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			MetacriticNeutronTemplatesSetup,
			NewsAndRatingsAdsMode,
			SlotTrackingSetup,
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
			MetacriticNeutronSlotsContextSetup,
			MetacriticNeutronNextPageAdsMode,
			MetacriticNeutronSeeMoreButtonClickListenerSetup,
		);
	}
}
