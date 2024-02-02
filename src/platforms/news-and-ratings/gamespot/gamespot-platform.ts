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
import { Injectable } from '@wikia/dependency-injection';
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
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			GamespotTargetingSetup,
			LoadTimesSetup,
			GamespotSlotsContextSetup,
			SlotsConfigurationExtender,
			GamespotDynamicSlotsSetup,
			GamespotPrebidConfigSetup,
			GamespotA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			GamespotTemplatesSetup,
			NewsAndRatingsAdsMode,
			SlotTrackingSetup,
			TrackingSetup,
			GamespotSeamlessContentObserverSetup,
			GamespotInfiniteScrollObserverSetup,
		);

		this.pipeline.execute();
	}
}
