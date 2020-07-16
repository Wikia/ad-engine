import { iocDefaultWarning } from '../utils/ioc-default-warning';

export class SlotsContextSetup {
	constructor() {
		iocDefaultWarning('SlotsContextSetup');
	}

	execute(): void {}
}
