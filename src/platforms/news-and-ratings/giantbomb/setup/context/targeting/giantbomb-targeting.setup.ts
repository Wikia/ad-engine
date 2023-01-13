import { DiProcess, targetingService } from '@wikia/ad-engine';

export class GiantbombTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
		};

		targetingService.extend(targeting);
	}
}
