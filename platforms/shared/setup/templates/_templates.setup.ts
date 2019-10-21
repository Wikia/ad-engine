import { utils } from '@wikia/ad-engine';

export class TemplatesSetup {
	constructor() {
		const warnGroup = 'TemplateSetup';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	configureTemplates(): void {}
}
