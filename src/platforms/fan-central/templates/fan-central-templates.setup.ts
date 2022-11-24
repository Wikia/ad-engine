import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerBfaaTemplate } from './bfaa-template';

@Injectable()
export class FanCentralTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);

		logTemplates(merge(bfaa$, floorAdhesion$));
	}
}
