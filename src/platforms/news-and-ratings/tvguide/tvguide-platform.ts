import {
	BiddersStateSetup,
	ConsentManagementPlatformSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	LoadTimesSetup,
	MetricReporterSetup,
	PreloadedLibrariesSetup,
	SlotsConfigurationExtender,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	context,
	DiProcess,
	IdentitySetup,
	logVersion,
	parallel,
	ProcessPipeline,
	sequential,
	utils,
} from '@wikia/ad-engine';
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

import './styles.scss';

@Injectable()
export class TvGuidePlatform implements DiProcess {
	constructor(
		private container: Container,
		private pipeline: ProcessPipeline,
		private spaWatchers: NewsAndRatingsNeutronHelper,
	) {}

	execute(): void {
		logVersion();
		context.extend(basicContext);
		context.set('state.isMobile', !utils.client.isDesktop());

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
			TrackingSetup,
		);

		this.pipeline.execute();
		this.setupSinglePageAppWatchers();
	}

	private setupSinglePageAppWatchers() {
		this.spaWatchers.setupPageChangedWatcher(
			this.container,
			NewsAndRatingsBaseContextSetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			TvGuideSlotsContextSetup,
			TvGuideNextPageAdsMode,
		);

		this.spaWatchers.setupPageExtendedWatcher(
			this.container,
			NewsAndRatingsBaseContextSetup,
			TvGuideTargetingSetup,
			NewsAndRatingsTargetingSetup,
			NewsAndRatingsAnyclipSetup,
			TvGuideNextPageAdsMode,
		);
	}
}
