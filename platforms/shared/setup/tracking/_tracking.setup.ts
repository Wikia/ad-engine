import { iocDefaultWarning } from '../../utils/iocDefaultWarning';

export class TrackingSetup {
	constructor() {
		const className = 'TemplatesSetup';
		iocDefaultWarning(className);
	}

	configureTracking(): void {}
}
