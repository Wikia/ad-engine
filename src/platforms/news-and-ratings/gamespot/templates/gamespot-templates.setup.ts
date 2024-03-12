import { logTemplates, TemplateRegistry, templateService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import {
	registerBfaaTemplate,
	registerFloorAdhesionTemplate,
	registerStickyTlbTemplate,
} from '../../shared';
import { registerUapDomElements } from './configs/register-uap-dom-elements';

@Injectable()
export class GamespotTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry, registerUapDomElements);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry, registerUapDomElements);

		logTemplates(merge(bfaa$, floorAdhesion$, stickyTlb$));
	}
}
