import { utils } from '@wikia/ad-engine';

export class DynamicSlotsSetup {
	constructor() {
		const warnGroup = 'DynamicSlotsSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureDynamicSlots(): void {}
}
