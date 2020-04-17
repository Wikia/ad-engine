import { TemplatesSetup } from '@platforms/shared';
import { logTemplates, PorvataTemplate, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { getOutstreamConfig } from './configs/outstream-config';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerSkinTemplate } from './skin-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpTemplatesSetup implements TemplatesSetup {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	configureTemplates(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const skin$ = registerSkinTemplate(this.registry);

		logTemplates(merge(bfaa$, bfab$, stickyTlb$, roadblock$, skin$));

		templateService.register(PorvataTemplate, getOutstreamConfig());
	}
}
