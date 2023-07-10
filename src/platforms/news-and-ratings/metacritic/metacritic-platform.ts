import { injectable } from 'tsyringe';

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
import { context, IdentitySetup, ProcessPipeline, utils } from '@wikia/ad-engine';

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
import { MetacriticA9ConfigSetup } from './setup/context/a9/metacritic-a9-config.setup';
import { MetacriticPrebidConfigSetup } from './setup/context/prebid/metacritic-prebid-config.setup';
import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticTargetingSetup } from './setup/context/targeting/metacritic-targeting.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';
import { MetacriticPageChangeGalleryObserver } from './setup/page-observers/metacritic-page-change-gallery-observer.setup';
import { MetacriticTemplatesSetup } from './templates/metacritic-templates.setup';

@injectable()
export class MetacriticPlatform {
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
			IdentitySetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			MetacriticTargetingSetup,
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
