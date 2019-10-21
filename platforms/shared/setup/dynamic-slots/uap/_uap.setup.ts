import { utils } from '@wikia/ad-engine';

export class UapSetup {
	constructor() {
		const warnGroup = 'UapSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureUap(): void {}
}
