import { iocDefaultWarning } from '../../../utils/ioc-default-warning';

export class A9ConfigSetup {
	constructor() {
		iocDefaultWarning('A9ConfigSetup');
	}

	configureA9Context(): void {}
}
