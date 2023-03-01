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
	targetingService,
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
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config-setup.service';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { TvGuidePageChangeAdsObserver } from './setup/page-change-observers/tvguide-page-change-ads-observer';
import { TvGuideSeamlessContentObserverSetup } from './setup/page-change-observers/tvguide-seamless-content-observer.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@Injectable()
export class TvGuidePlatform {
	private currentUrl = '';
	private currentPageViewGuid;

	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TrackingParametersSetup,
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
			TvGuideSeamlessContentObserverSetup,
		);

		this.pipeline.execute();
	}

	setupPageChangeWatcher(container: Container) {
		const config = { subtree: false, childList: true };
		const observer = new MutationObserver(() => {
			if (!this.currentPageViewGuid) {
				this.currentPageViewGuid = window.utag_data?.pageViewGuid;
			}

			if (!this.currentUrl) {
				this.currentUrl = location.href;
				return;
			}

			if (
				this.currentUrl !== location.href &&
				this.currentPageViewGuid !== window.utag_data?.pageViewGuid
			) {
				utils.logger('pageChangeWatcher', 'SPA', 'url changed', location.href);

				this.currentUrl = location.href;
				this.currentPageViewGuid = window.utag_data?.pageViewGuid;

				communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);
				targetingService.clear();

				const refreshPipeline = new ProcessPipeline(container);
				refreshPipeline
					.add(
						() => utils.logger('SPA', 'starting pipeline refresh', location.href),
						NewsAndRatingsBaseContextSetup,
						TvGuideTargetingSetup,
						NewsAndRatingsTargetingSetup,
						TvGuideSlotsContextSetup,
						TvGuidePageChangeAdsObserver,
						TvGuideSeamlessContentObserverSetup,
					)
					.execute();
			}
		});

		observer.observe(document.querySelector('title'), config);
	}
}
