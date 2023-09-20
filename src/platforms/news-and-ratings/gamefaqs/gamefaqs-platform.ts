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
import { Injectable } from '@wikia/dependency-injection';
import {
	BiddersStateOverwriteSetup,
	NewsAndRatingsAdsMode,
	NewsAndRatingsAnyclipSetup,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { GamefaqsA9ConfigSetup } from './setup/context/a9/gamefaqs-a9-config.setup';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsTargetingSetup } from './setup/context/targeting/gamefaqs-targeting.setup';
import { GamefaqsTemplatesSetup } from './templates/gamefaqs-templates.setup';

@Injectable()
export class GamefaqsPlatform {
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
			GamefaqsTargetingSetup,
			LoadTimesSetup,
			GamefaqsSlotsContextSetup,
			SlotsConfigurationExtender,
			NewsAndRatingsAnyclipSetup,
			NewsAndRatingsDynamicSlotsSetup,
			GamefaqsPrebidConfigSetup,
			GamefaqsA9ConfigSetup,
			BiddersStateSetup,
			BiddersStateOverwriteSetup,
			GamefaqsTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
		);

		this.pipeline.execute();
	}
}
