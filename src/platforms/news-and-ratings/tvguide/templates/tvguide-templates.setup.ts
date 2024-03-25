// @ts-strict-ignore
import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import {
	registerFloorAdhesionTemplate,
	registerStickyTlbTemplate,
} from '../../shared';
import { registerUapDomElements } from './configs/register-uap-dom-elements';

@Injectable()
export class TvGuideTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry, registerUapDomElements);

		logTemplates(merge(floorAdhesion$, stickyTlb$));
	}
}
