import { iocDefaultWarning } from '../utils/ioc-default-warning';

export class BillTheLizardSetup {
	constructor() {
		iocDefaultWarning('BillTheLizardSetup');
	}

	execute(): void {}
}
