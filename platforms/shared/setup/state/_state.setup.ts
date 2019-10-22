import { iocDefaultWarning } from '../../utils/iocDefaultWarning';

export class StateSetup {
	constructor() {
		const className = 'StateSetup';
		iocDefaultWarning(className);
	}

	configureState(): void {}
}
