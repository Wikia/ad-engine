import { iocDefaultWarning } from '../../../utils/ioc-default-warning';

export class UapSetup {
	constructor() {
		iocDefaultWarning('UapSetup');
	}

	configureUap(): void {}
}
