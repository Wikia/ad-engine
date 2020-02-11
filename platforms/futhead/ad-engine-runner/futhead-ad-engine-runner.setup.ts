import {
	AdEngineRunnerSetup,
	babDetection,
	biddersDelay,
	configureEventService,
} from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FutheadAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor() {}

	configureAdEngineRunner(): void {
		context.push('delayModules', babDetection);
		context.push('delayModules', biddersDelay);
		configureEventService();
	}
}
