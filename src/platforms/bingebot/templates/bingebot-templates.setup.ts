import { logTemplates, TemplateRegistry, templateService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerSponsoredLogoTemplate } from './sponsored-logo-template';
import { registerSponsoredTextLogoTemplate } from './sponsored-text-logo-template';

@Injectable()
export class BingeBotTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const sponsoredLogo$ = registerSponsoredLogoTemplate(this.registry);
		const sponsoredTextLogo$ = registerSponsoredTextLogoTemplate(this.registry);

		logTemplates(merge(sponsoredLogo$, sponsoredTextLogo$));
	}
}
