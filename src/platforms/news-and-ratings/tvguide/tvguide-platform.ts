import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LoadTimesSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

import { SlotsConfigurationExtender } from '../../shared/setup/slots-config-extender';
import {
	BiddersStateOverwriteSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { NewsAndRatingsDynamicSlotsEventsSetup } from '../shared/setup/dynamic-slots/news-and-ratings-dynamic-slots-events.setup';
import { NewsAndRatingsSpaHelper } from '../shared/setup/dynamic-slots/news-and-ratings-spa-helper';
import { basicContext } from './ad-context';
import { TvGuideNextPageAdsMode } from './modes/tvguide-next-page-ads.mode';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config.setup';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@Injectable()
export class TvGuidePlatform {
	constructor(private pipeline: ProcessPipeline, private spaWatchers: NewsAndRatingsSpaHelper) {}

	execute(container: Container): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TrackingParametersSetup,
			LoadTimesSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			TvGuideSlotsContextSetup,
			SlotsConfigurationExtender,
			NewsAndRatingsDynamicSlotsEventsSetup,
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
			TvGuideSlotsContextSetup,
			TvGuideNextPageAdsMode,
		);

		this.spaWatchers.setupPageExtendedWatcher(
			container,
			NewsAndRatingsBaseContextSetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			TvGuideNextPageAdsMode,
		);
	}
}
