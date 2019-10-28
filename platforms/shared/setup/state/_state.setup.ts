import { iocDefaultWarning } from '../../utils/ioc-default-warning';

export class StateSetup {
	constructor() {
		iocDefaultWarning('StateSetup');
	}

	configureState(): void {}
}
