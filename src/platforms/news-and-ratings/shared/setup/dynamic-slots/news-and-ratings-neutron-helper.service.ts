import { communicationService, eventsRepository } from '@ad-engine/communication';
import { targetingService, updateGptTargeting } from '@ad-engine/core';
import { ProcessPipeline } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import { TrackingParametersSetup } from '@platforms/shared';
import { Container, Injectable } from '@wikia/dependency-injection';

const logGroup = 'SPA';

@Injectable()
export class NewsAndRatingsNeutronHelper {
	setupPageExtendedWatcher(container: Container, ...steps: any[]) {
		communicationService.on(
			eventsRepository.PLATFORM_PAGE_EXTENDED,
			() => {
				logger(logGroup, 'page extended', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline(container);
				refreshPipeline
					.add(() => logger(logGroup, 'starting pipeline refresh'), ...steps)
					.execute();
			},
			false,
		);
	}

	setupPageChangedWatcher(container: Container, ...steps: any[]) {
		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			async () => {
				logger(logGroup, 'url changed', location.href);

				const trackingParametersSetup = container.get(TrackingParametersSetup);
				await trackingParametersSetup.setTrackingParameters();

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline(container);
				refreshPipeline
					.add(
						() => logger(logGroup, 'starting pipeline refresh'),
						...steps,
						() => updateGptTargeting(),
					)
					.execute();
			},
			false,
		);
	}
}
