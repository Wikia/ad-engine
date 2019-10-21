import { utils } from '@wikia/ad-engine';

export class AdEngineRunnerSetup {
	constructor() {
		const warnGroup = 'AdEngineRunnerSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureAdEngineRunner(): void {}
}
