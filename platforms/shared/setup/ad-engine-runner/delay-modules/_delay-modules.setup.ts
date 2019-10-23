import { iocDefaultWarning } from '../../../utils/ioc-default-warning';

export class DelayModulesSetup {
	constructor() {
		iocDefaultWarning('DelayModulesSetup');
	}

	configureDelayModules(): void {}
}
