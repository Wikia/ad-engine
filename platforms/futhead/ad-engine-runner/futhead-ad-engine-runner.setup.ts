import { AdEngineRunnerSetup, configureEventService } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FutheadAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor() {}

	configureAdEngineRunner(): void {
		configureEventService();
	}
}
