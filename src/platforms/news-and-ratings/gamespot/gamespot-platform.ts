import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporter,
	MetricReporterSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SlotsConfigurationExtender } from '../../shared/setup/slots-config-extender';
import {
	BiddersStateOverwriteSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsAnyclipSetup,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { GamespotA9ConfigSetup } from './setup/context/a9/gamespot-a9-config.setup';
import { GamespotDynamicSlotsSetup } from './setup/context/dynamic-slots/gamespot-dynamic-slots.setup';
import { GamespotPrebidConfigSetup } from './setup/context/prebid/gamespot-prebid-config.setup';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotTargetingSetup } from './setup/context/targeting/gamespot-targeting.setup';
import { GamespotInfiniteScrollObserverSetup } from './setup/page-change-observers/gamespot-infinite-scroll-observer.setup';
import { GamespotSeamlessContentObserverSetup } from './setup/page-change-observers/gamespot-seamless-content-observer.setup';
import { GamespotTemplatesSetup } from './templates/gamespot-templates.setup';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
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
			NewsAndRatingsAnyclipSetup,
			GamespotTargetingSetup,
			GamespotSlotsContextSetup,
			SlotsConfigurationExtender,
			GamespotDynamicSlotsSetup,
			GamespotPrebidConfigSetup,
			GamespotA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			GamespotTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
			GamespotSeamlessContentObserverSetup,
			GamespotInfiniteScrollObserverSetup,
		);

		this.pipeline.execute();
	}
}
