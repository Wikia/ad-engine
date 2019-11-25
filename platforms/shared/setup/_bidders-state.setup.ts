import { iocDefaultWarning } from '../utils/ioc-default-warning';

export class BiddersStateSetup {
	constructor() {
		iocDefaultWarning('DynamicSlotsSetup');
	}

	configureBiddersState(): void {}
}
