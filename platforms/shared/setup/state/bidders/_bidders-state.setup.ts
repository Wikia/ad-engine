import { utils } from '@wikia/ad-engine';

export class BiddersStateSetup {
	constructor() {
		const warnGroup = 'BiddersStateSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureBiddersState(): void {}
}
