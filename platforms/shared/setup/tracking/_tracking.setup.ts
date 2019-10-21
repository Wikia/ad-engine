import { utils } from '@wikia/ad-engine';

export class TrackingSetup {
	constructor() {
		const warnGroup = 'TrackingSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureTracking(): void {}
}
