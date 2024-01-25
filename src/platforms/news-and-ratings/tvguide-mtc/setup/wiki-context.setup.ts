import { DiProcess, targetingService } from '@wikia/ad-engine';

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		targetingService.set('skin', 'tvguide-mtc');
	}
}
