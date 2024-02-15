import { logTemplates, TemplateRegistry, templateService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
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
