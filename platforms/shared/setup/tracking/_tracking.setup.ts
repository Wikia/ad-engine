import { iocDefaultWarning } from '../../utils/ioc-default-warning';

export class TrackingSetup {
	constructor() {
		iocDefaultWarning('TemplatesSetup');
	}

	configureTracking(): void {}
}
