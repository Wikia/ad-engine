import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerSponsoredTextLogoTemplate } from './sponsored-text-logo-template';

@Injectable()
export class BingebotTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const sponsoredTextLogo$ = registerSponsoredTextLogoTemplate(this.registry);

		logTemplates(merge(sponsoredTextLogo$));
	}
}
