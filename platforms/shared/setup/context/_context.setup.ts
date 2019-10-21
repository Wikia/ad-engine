import { utils } from '@wikia/ad-engine';

export class ContextSetup {
	constructor() {
		const warnGroup = 'ContextSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureContext(isOptedIn: boolean, isMobile: boolean): void {}
}
