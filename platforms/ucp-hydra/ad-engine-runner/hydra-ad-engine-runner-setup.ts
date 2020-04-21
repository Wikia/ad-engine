import { AdEngineRunnerSetup, configureEventService } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor() {}

	configureAdEngineRunner(): void {
		configureEventService();
	}
}
