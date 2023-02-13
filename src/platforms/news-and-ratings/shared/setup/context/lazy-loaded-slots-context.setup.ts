import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class LazyLoadedSlotsContextSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		context.set('events.pushOnScroll.ids', []);
		context.set(
			'events.pushOnScroll.threshold',
			this.instantConfig.get('icPushOnScrollThreshold', 100),
		);
	}
}
