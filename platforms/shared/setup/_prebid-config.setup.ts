import { iocDefaultWarning } from '../utils/ioc-default-warning';

export class PrebidConfigSetup {
	constructor() {
		iocDefaultWarning('PrebidConfigSetup');
	}

	configurePrebidContext(): void {}
}
