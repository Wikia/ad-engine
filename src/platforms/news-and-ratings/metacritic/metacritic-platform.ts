import { Injectable } from '@wikia/dependency-injection';

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
import {
	BiddersStateOverwriteSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsAnyclipSetup,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { MetacriticA9ConfigSetup } from './setup/context/a9/metacritic-a9-config.setup';
import { MetacriticPrebidConfigSetup } from './setup/context/prebid/metacritic-prebid-config.setup';
import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticTargetingSetup } from './setup/context/targeting/metacritic-targeting.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';
import { MetacriticPageChangeGalleryObserver } from './setup/page-observers/metacritic-page-change-gallery-observer.setup';
import { MetacriticTemplatesSetup } from './templates/metacritic-templates.setup';

@Injectable()
export class MetacriticPlatform {
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
			MetacriticTargetingSetup,
			LoadTimesSetup,
			MetacriticSlotsContextSetup,
			MetacriticDynamicSlotsSetup,
			SlotsConfigurationExtender,
			MetacriticPrebidConfigSetup,
			MetacriticA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			MetacriticTemplatesSetup,
			NewsAndRatingsAdsMode,
			SlotTrackingSetup,
			TrackingSetup,
			MetacriticPageChangeGalleryObserver,
		);

		this.pipeline.execute();
	}
}
