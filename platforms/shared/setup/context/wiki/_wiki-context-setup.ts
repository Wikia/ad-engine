import { iocDefaultWarning } from '../../../utils/ioc-default-warning';

export class WikiContextSetup {
	constructor() {
		iocDefaultWarning('WikiContextSetup');
	}

	configureWikiContext(): void {}
}
