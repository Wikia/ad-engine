import {
	communicationService,
	eventsRepository,
	ProcessPipeline,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { DependencyContainer, injectable } from 'tsyringe';

const logGroup = 'SPA';

@injectable()
export class NewsAndRatingsNeutronHelper {
	private firstPageview = true;

	setupPageExtendedWatcher(container: DependencyContainer, ...steps: any[]) {
		communicationService.on(
			eventsRepository.PLATFORM_PAGE_EXTENDED,
			() => {
				utils.logger(logGroup, 'page extended', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline();
				refreshPipeline
					.add(() => utils.logger(logGroup, 'starting pipeline refresh'), ...steps)
					.execute();
			},
			false,
		);
	}

	setupPageChangedWatcher(container: DependencyContainer, ...steps: any[]) {
		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			() => {
				if (this.firstPageview) {
					this.firstPageview = false;
					return;
				}

				utils.logger(logGroup, 'url changed', location.href);

				targetingService.clear();

				const refreshPipeline = new ProcessPipeline();
				refreshPipeline
					.add(() => utils.logger(logGroup, 'starting pipeline refresh'), ...steps)
					.execute();
			},
			false,
		);
	}
}
