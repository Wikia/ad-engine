// @ts-strict-ignore
import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from '../../shared';
// eslint-disable-next-line no-restricted-imports
import { registerUapDomElements } from '../../tvguide/templates/configs/register-uap-dom-elements';

@Injectable()
export class TvGuideMtcTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry, registerUapDomElements);

		logTemplates(merge(bfaa$));
	}
}
