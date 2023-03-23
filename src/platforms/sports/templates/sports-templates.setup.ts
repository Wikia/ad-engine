import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { merge } from 'rxjs';
import { injectable } from 'tsyringe';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';

@injectable()
export class SportsTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);

		logTemplates(merge(bfaa$, bfab$));
	}
}
