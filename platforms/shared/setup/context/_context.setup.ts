import { iocDefaultWarning } from '../../utils/iocDefaultWarning';

export class ContextSetup {
	constructor() {
		const className = 'ContextSetup';
		iocDefaultWarning(className);
	}

	configureContext(isOptedIn: boolean, isMobile: boolean): void {}
}
