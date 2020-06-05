import { TemplatesSetup } from '@platforms/shared';
import {
	FloatingRail,
	logTemplates,
	Roadblock,
	TemplateRegistry,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class F2TemplateSetup implements TemplatesSetup {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	configureTemplates(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);

		// templateService.register(BigFancyAdBelow, getBfabConfig());
		// templateService.register(StickyTLB, getStickyConfig());

		logTemplates(merge(bfaa$, bfab$, stickyTlb$));

		templateService.register(Roadblock, {
			slotsToEnable: ['top_leaderboard', 'top_boxad'],
			slotsToDisable: [],
		});
		templateService.register(FloatingRail, {
			enabled: false,
		});
	}
}
