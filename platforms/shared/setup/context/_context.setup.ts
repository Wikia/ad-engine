import { iocDefaultWarning } from '../../utils/ioc-default-warning';

export class ContextSetup {
	constructor() {
		iocDefaultWarning('ContextSetup');
	}

	configureContext(isOptedIn: boolean, isMobile: boolean): void {}
}
