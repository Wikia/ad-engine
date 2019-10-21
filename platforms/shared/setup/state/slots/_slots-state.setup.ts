import { utils } from '@wikia/ad-engine';

export class SlotsStateSetup {
	constructor() {
		const warnGroup = 'SlotsStateSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureSlotsState(): void {}
}
