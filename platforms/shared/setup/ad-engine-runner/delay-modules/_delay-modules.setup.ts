import { iocDefaultWarning } from '../../../utils/iocDefaultWarning';

export class DelayModulesSetup {
	constructor() {
		const className = 'DelayModulesSetup';
		iocDefaultWarning(className);
	}

	configureDelayModules(): void {}
}
