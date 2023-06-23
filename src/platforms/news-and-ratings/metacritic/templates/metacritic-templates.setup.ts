import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate, registerFloorAdhesionTemplate } from '../../shared';
import { registerUapDomElements } from './configs/register-uap-dom-elements';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class MetacriticTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry, registerUapDomElements);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);

		logTemplates(merge(bfaa$, stickyTlb$, floorAdhesion$));
	}
}
