import { DiProcess, targetingService } from '@wikia/ad-engine';

export class TvGuideTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
		};

		targetingService.extend(targeting);
	}
}
