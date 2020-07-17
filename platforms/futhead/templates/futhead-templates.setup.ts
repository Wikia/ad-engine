import { registerBfaaTemplate, registerBfabTemplate, TemplatesSetup } from '@platforms/shared';
import { logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerLogoReplacementTemplate } from './logo-replacement/logo-replacement-template';

@Injectable()
export class FutheadTemplatesSetup implements TemplatesSetup {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	configureTemplates(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const logoReplacement$ = registerLogoReplacementTemplate(this.registry);

		logTemplates(merge(bfaa$, bfab$, logoReplacement$));
	}
}
