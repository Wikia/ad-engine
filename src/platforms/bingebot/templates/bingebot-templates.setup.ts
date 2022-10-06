import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
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
