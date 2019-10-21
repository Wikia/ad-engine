import { utils } from '@wikia/ad-engine';

export class StateSetup {
	constructor() {
		const warnGroup = 'StateSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureState(): void {}
}
