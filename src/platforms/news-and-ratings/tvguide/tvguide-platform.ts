import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LoadTimesSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	communicationService,
	context,
	eventsRepository,
	ProcessPipeline,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { TvGuideNextPageAdsMode } from './modes/tvguide-next-page-ads.mode';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config.setup';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@injectable()
export class TvGuidePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
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
			TvGuideDynamicSlotsSetup,
			TvGuidePrebidConfigSetup,
			TvGuideA9ConfigSetup,
			BiddersStateSetup,
			TvGuideTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
		);

		this.pipeline.execute();
		this.setupSinglePageAppWatchers();
	}

	private setupSinglePageAppWatchers() {
		let firstPageview = true;

		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			() => {
				if (firstPageview) {
					firstPageview = false;
					return;
				}

				utils.logger('SPA', 'url changed', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline();
				refreshPipeline
					.add(
						() => utils.logger('SPA', 'starting pipeline refresh'),
						NewsAndRatingsBaseContextSetup,
						TvGuideTargetingSetup,
						NewsAndRatingsTargetingSetup,
						TvGuideSlotsContextSetup,
						TvGuideNextPageAdsMode,
					)
					.execute();
			},
			false,
		);

		communicationService.on(
			eventsRepository.PLATFORM_PAGE_EXTENDED,
			() => {
				utils.logger('SPA', 'page extended', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline();
				refreshPipeline
					.add(
						() => utils.logger('SPA', 'starting pipeline refresh'),
						NewsAndRatingsBaseContextSetup,
						TvGuideTargetingSetup,
						NewsAndRatingsTargetingSetup,
						TvGuideNextPageAdsMode,
					)
					.execute();
			},
			false,
		);
	}
}
