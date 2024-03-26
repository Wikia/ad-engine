// @ts-strict-ignore
import { context, DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import {
	registerFloorAdhesionTemplate,
	registerStickyTlbTemplate,
} from '../../shared';
import { registerUapDomElements } from './configs/register-uap-dom-elements';

@Injectable()
export class GamespotTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);

		context.set('uap.dom.nav', '#masthead');
		context.set('uap.dom.footer', '#footer');
	}

	execute(): void {
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry, registerUapDomElements);

		logTemplates(merge(floorAdhesion$, stickyTlb$));
	}
}
