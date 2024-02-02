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
	NewsAndRatingsAnyclipSetup,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsNeutronSetup,
	NewsAndRatingsNeutronHelper,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { TvGuideNextPageAdsMode } from './modes/tvguide-next-page-ads.mode';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config.setup';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@Injectable()
export class TvGuidePlatform {
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
			TrackingParametersSetup,
			MetricReporterSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			IdentitySetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			LoadTimesSetup,
			NewsAndRatingsAnyclipSetup,
			TvGuideSlotsContextSetup,
			SlotsConfigurationExtender,
			NewsAndRatingsDynamicSlotsNeutronSetup,
			TvGuidePrebidConfigSetup,
			TvGuideA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			TvGuideTemplatesSetup,
			NewsAndRatingsAdsMode,
			SlotTrackingSetup,
			TrackingSetup,
		);

		this.pipeline.execute();
		this.setupSinglePageAppWatchers(container);
	}

	private setupSinglePageAppWatchers(container: Container) {
		this.spaWatchers.setupPageChangedWatcher(
			container,
			NewsAndRatingsBaseContextSetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			TvGuideSlotsContextSetup,
			TvGuideNextPageAdsMode,
		);

		this.spaWatchers.setupPageExtendedWatcher(
			container,
			NewsAndRatingsBaseContextSetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			TvGuideNextPageAdsMode,
		);
	}
}
