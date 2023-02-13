import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	communicationService,
	context,
	eventsRepository,
	ProcessPipeline,
	utils,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { TvGuidePageChangeAdsMode } from './modes/tvguide-page-change-ads-mode';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config-setup.service';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@Injectable()
export class TvGuidePlatform {
	private currentUrl = '';

	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			TrackingParametersSetup,
			InstantConfigSetup,
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
	}

	setupPageChangeWatcher(container: Container) {
		const config = { subtree: true, childList: true };
		const observer = new MutationObserver(() => {
			if (!this.currentUrl) {
				this.currentUrl = location.href;
				return;
			}

			if (this.currentUrl !== location.href) {
				utils.logger('SPA', 'url changed', location.href);

				this.currentUrl = location.href;
				communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);

				context.set('targeting', {});

				const refreshPipeline = new ProcessPipeline(container);
				refreshPipeline
					.add(
						() => utils.logger('SPA', 'starting pipeline refresh', location.href),
						NewsAndRatingsBaseContextSetup,
						TvGuideTargetingSetup,
						NewsAndRatingsTargetingSetup,
						TvGuideSlotsContextSetup,
						TvGuidePageChangeAdsMode,
					)
					.execute();
			}
		});

		observer.observe(document.querySelector('title'), config);
	}
}
