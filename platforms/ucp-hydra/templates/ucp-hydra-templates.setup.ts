import { TemplatesSetup } from '@platforms/shared';
import { logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { registerLogoReplacementTemplate } from './logo-replacement-template';

@Injectable()
export class UcpHydraTemplatesSetup implements TemplatesSetup {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const logoReplacement$ = registerLogoReplacementTemplate(this.registry);

		logTemplates(merge(bfaa$, bfab$, logoReplacement$));
	}
}
