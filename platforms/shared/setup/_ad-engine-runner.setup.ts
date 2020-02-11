import { iocDefaultWarning } from '../utils/ioc-default-warning';

export class AdEngineRunnerSetup {
	constructor() {
		iocDefaultWarning('AdEngineRunnerSetup');
	}

	configureAdEngineRunner(): void {}
}
