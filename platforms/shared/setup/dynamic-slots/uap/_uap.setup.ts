import { iocDefaultWarning } from '../../../utils/iocDefaultWarning';

export class UapSetup {
	constructor() {
		const className = 'UapSetup';
		iocDefaultWarning(className);
	}

	configureUap(): void {}
}
