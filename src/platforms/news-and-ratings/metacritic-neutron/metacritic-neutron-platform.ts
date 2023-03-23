import { Container, Injectable } from '@wikia/dependency-injection';

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

import { SlotsConfigurationExtender } from '../../shared/setup/slots-config-extender';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { MetacriticNeutronNextPageAdsMode } from './modes/metacritic-neutron-next-page-ads.mode';
import { MetacriticNeutronA9ConfigSetup } from './setup/context/a9/metacritic-neutron-a9-config.setup';
import { MetacriticNeutronPrebidConfigSetup } from './setup/context/prebid/metacritic-neutron-prebid-config.setup';
import { MetacriticNeutronSlotsContextSetup } from './setup/context/slots/metacritic-neutron-slots-context.setup';
import { MetacriticNeutronTargetingSetup } from './setup/context/targeting/metacritic-neutron-targeting.setup';
import { MetacriticNeutronDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-neutron-dynamic-slots.setup';
import { MetacriticNeutronSeeMoreButtonClickListenerSetup } from './setup/page-change-observers/metacritic-neutron-see-more-button-click-listener.setup';
import { MetacriticNeutronTemplatesSetup } from './templates/metacritic-neutron-templates.setup';

@Injectable()
export class MetacriticNeutronPlatform {
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
			NewsAndRatingsTargetingSetup,
			MetacriticNeutronTargetingSetup,
			MetacriticNeutronSlotsContextSetup,
			SlotsConfigurationExtender,
			MetacriticNeutronDynamicSlotsSetup,
			MetacriticNeutronPrebidConfigSetup,
			MetacriticNeutronA9ConfigSetup,
			BiddersStateSetup,
			MetacriticNeutronTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
			MetacriticNeutronSeeMoreButtonClickListenerSetup,
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
						() => utils.logger('SPA', 'starting pipeline refresh', location.pathname),
						NewsAndRatingsBaseContextSetup,
						MetacriticNeutronTargetingSetup,
						NewsAndRatingsTargetingSetup,
						MetacriticNeutronSlotsContextSetup,
						MetacriticNeutronNextPageAdsMode,
						MetacriticNeutronSeeMoreButtonClickListenerSetup,
					)
					.execute();
			}
		});

		observer.observe(document.querySelector('title'), config);
	}
}
