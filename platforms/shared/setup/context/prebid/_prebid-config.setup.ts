import { iocDefaultWarning } from '../../../utils/iocDefaultWarning';

export class PrebidConfigSetup {
	constructor() {
		const className = 'PrebidConfigSetup';
		iocDefaultWarning(className);
	}

	configurePrebidContext(): void {}
}
