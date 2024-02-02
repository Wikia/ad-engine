import { targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		targetingService.set('skin', 'tvguide-mtc');
	}
}
