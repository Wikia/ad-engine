import { Injectable } from '@wikia/dependency-injection';

import {
	BiddersStateSetup,
	bootstrap,
	ConsentManagementPlatformSetup,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporter,
	MetricReporterSetup,
	PreloadedLibrariesSetup,
	SlotsConfigurationExtender,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	context,
	IdentitySetup,
	parallel,
	ProcessPipeline,
	sequential,
	utils,
} from '@wikia/ad-engine';
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
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			() => bootstrap(),
			parallel(
				sequential(InstantConfigSetup, PreloadedLibrariesSetup),
				ConsentManagementPlatformSetup,
			),
			TrackingParametersSetup,
			MetricReporterSetup,
			MetricReporter,
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
			TrackingSetup,
			MetacriticPageChangeGalleryObserver,
		);

		this.pipeline.execute();
	}
}
