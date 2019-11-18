import {
	AdEngineRunnerSetup,
	babDetection,
	biddersDelay,
	configureEventService,
} from '@platforms/shared';
import { context, taxonomyService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor() {}

	configureAdEngineRunner(): void {
		context.push('delayModules', babDetection);
		context.push('delayModules', biddersDelay);
		context.push('delayModules', taxonomyService);
		configureEventService();
	}
}
