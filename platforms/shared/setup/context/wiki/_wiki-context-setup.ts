import { iocDefaultWarning } from '../../../utils/iocDefaultWarning';

export class WikiContextSetup {
	constructor() {
		const className = 'WikiContextSetup';
		iocDefaultWarning(className);
	}

	configureWikiContext(): void {}
}
