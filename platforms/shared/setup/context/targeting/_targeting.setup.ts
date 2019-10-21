import { utils } from '@wikia/ad-engine';

export class TargetingSetup {
	constructor() {
		const warnGroup = 'TargetingSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureTargetingContext(): void {}
}
