import { utils } from '@wikia/ad-engine';

export class WikiContextSetup {
	constructor() {
		const warnGroup = 'WikiContextSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureWikiContext(): void {}
}
