import { utils } from '@wikia/ad-engine';

export class A9ConfigSetup {
	constructor() {
		const warnGroup = 'A9ConfigSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureA9Context(): void {}
}
