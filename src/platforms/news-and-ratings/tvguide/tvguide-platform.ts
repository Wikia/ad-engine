import { BiddersStateSetup, bootstrapAndGetConsent, InstantConfigSetup } from '@platforms/shared';
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
import { TvGuidePageChangeAdsMode } from './modes/tvguide-page-change-ads-mode';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config-setup.service';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@injectable()
export class TvGuidePlatform {
	private currentUrl = '';

	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
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
		);

		this.pipeline.execute();
	}

	setupPageChangeWatcher() {
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
				targetingService.clear();

				const refreshPipeline = new ProcessPipeline();
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
