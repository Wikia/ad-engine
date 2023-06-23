import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from '../../shared';
import { registerStickyLocTopTemplate } from '../../shared/templates/sticky-loc-top-template';
import { registerUapDomElements } from './configs/register-uap-dom-elements';

@Injectable()
export class GiantbombTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry, registerUapDomElements);
		const sticky$ = registerStickyLocTopTemplate(this.registry, registerUapDomElements);

		logTemplates(merge(bfaa$, sticky$));
	}
}
