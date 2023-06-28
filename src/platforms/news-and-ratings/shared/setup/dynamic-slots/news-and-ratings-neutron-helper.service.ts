import {
	communicationService,
	eventsRepository,
	ProcessPipeline,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

const logGroup = 'SPA';

@Injectable()
export class NewsAndRatingsNeutronHelper {
	setupPageExtendedWatcher(container: Container, ...steps: any[]) {
		communicationService.on(
			eventsRepository.PLATFORM_PAGE_EXTENDED,
			() => {
				utils.logger(logGroup, 'page extended', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline(container);
				refreshPipeline
					.add(() => utils.logger(logGroup, 'starting pipeline refresh'), ...steps)
					.execute();
			},
			false,
		);
	}

	setupPageChangedWatcher(container: Container, ...steps: any[]) {
		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			() => {
				utils.logger(logGroup, 'url changed', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline(container);
				refreshPipeline
					.add(() => utils.logger(logGroup, 'starting pipeline refresh'), ...steps)
					.execute();
			},
			false,
		);
	}
}
