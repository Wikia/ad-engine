import { AdEngineRunnerSetup, configureEventService } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor() {}

	configureAdEngineRunner(): void {
		configureEventService();
	}
}
