import { utils } from '@wikia/ad-engine';

export class PrebidConfigSetup {
	constructor() {
		const warnGroup = 'PrebidConfigSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configurePrebidContext(): void {}
}
