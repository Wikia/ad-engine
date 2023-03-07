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
import { TvGuidePageChangeAdsObserver } from './modes/tvguide-page-change-ads.observer';
import { TvGuideA9ConfigSetup } from './setup/context/a9/tvguide-a9-config.setup';
import { TvGuidePrebidConfigSetup } from './setup/context/prebid/tvguide-prebid-config-setup.service';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideTargetingSetup } from './setup/context/targeting/tvguide-targeting.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { TvGuideTemplatesSetup } from './templates/tvguide-templates.setup';

@Injectable()
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

		// ToDo: Remove this test code
		window.addEventListener(
			'keypress',
			(event) => {
				if (event.code === 'Digit1') {
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'omni-skybox-leader-sticky',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'incontent-leader-plus-top',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'incontent-leader-plus-inc',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'incontent-leader-plus-inc',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'incontent-leader-plus-inc',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'incontent-leader-plus-inc',
					});
				}

				if (event.code === 'Digit2') {
					communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);
				}

				if (event.code === 'Digit3') {
					communicationService.emit(eventsRepository.PLATFORM_PAGE_CHANGED);
				}

				if (event.code === 'Digit4') {
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'omni-skybox-leader-sticky',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'mpu-plus-top',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'mpu-middle',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'mpu-bottom',
					});
					communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
						placementId: 'incontent-leader-plus-bottom',
					});
				}

				if (event.code === 'Digit5') {
					communicationService.emit(eventsRepository.PLATFORM_PAGE_EXTENDED);
				}
			},
			false,
		);
	}

	setupPageChangeWatcher(container: Container) {
		communicationService.on(eventsRepository.PLATFORM_PAGE_CHANGED, () => {
			utils.logger('SPA', 'SPA', 'url changed', location.href);

			// ToDo: Emit this if PLATFORM_BEFORE_PAGE_CHANGE won't be emitted by TVGuide app
			// communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);

			targetingService.clear();

			const refreshPipeline = new ProcessPipeline(container);
			refreshPipeline
				.add(
					() => utils.logger('SPA', 'starting pipeline refresh'),
					NewsAndRatingsBaseContextSetup,
					TvGuideTargetingSetup,
					NewsAndRatingsTargetingSetup,
					TvGuideSlotsContextSetup,
					TvGuidePageChangeAdsObserver,
				)
				.execute();
		});

		communicationService.on(eventsRepository.PLATFORM_PAGE_EXTENDED, () => {
			utils.logger('SPA', 'SPA', 'page extended', location.href);

			targetingService.clear();

			const refreshPipeline = new ProcessPipeline(container);
			refreshPipeline
				.add(
					() => utils.logger('SPA', 'starting pipeline refresh'),
					NewsAndRatingsBaseContextSetup,
					TvGuideTargetingSetup,
					NewsAndRatingsTargetingSetup,
					TvGuidePageChangeAdsObserver,
				)
				.execute();
		});
	}
}
