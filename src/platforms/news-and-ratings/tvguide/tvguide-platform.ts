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
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
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
