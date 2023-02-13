import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { merge } from 'rxjs';
import { injectable } from 'tsyringe';
import { registerBfaaTemplate } from '../../shared';
import { registerUapDomElements } from './configs/register-uap-dom-elements';

@injectable()
export class MetacriticTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry, registerUapDomElements);

		logTemplates(merge(bfaa$));
	}
}
