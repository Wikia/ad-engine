import { utils } from '@wikia/ad-engine';

export class DelayModulesSetup {
	constructor() {
		const warnGroup = 'DelayModulesSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureDelayModules(): void {}
}
