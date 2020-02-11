import { iocDefaultWarning } from '../utils/ioc-default-warning';

export class TargetingSetup {
	constructor() {
		iocDefaultWarning('TargetingSetup');
	}

	configureTargetingContext(): void {}
}
