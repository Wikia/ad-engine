import { AdEngineRunnerSetup, configureEventService } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpAdEngineRunnerSetup implements AdEngineRunnerSetup {
	constructor() {}

	configureAdEngineRunner(): void {
		configureEventService();
	}
}
