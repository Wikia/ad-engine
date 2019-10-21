import { utils } from '@wikia/ad-engine';

export class SlotsContextSetup {
	constructor() {
		const warnGroup = 'SlotsContextSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureSlotsContext(): void {}
}
