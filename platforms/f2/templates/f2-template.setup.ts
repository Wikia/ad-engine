import { TemplatesSetup } from '@platforms/shared';
import { FloatingRail, Roadblock, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { registerBfaaTemplate } from './bfaa-template';

@Injectable()
export class F2TemplateSetup implements TemplatesSetup {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	configureTemplates(): void {
		// const bfaa$ = registerBfaaTemplate(this.registry);
		registerBfaaTemplate(this.registry);

		// templateService.register(BigFancyAdBelow, getBfabConfig());
		// templateService.register(StickyTLB, getStickyConfig());

		// logTemplates(merge(bfaa$));

		templateService.register(Roadblock, {
			slotsToEnable: ['top_leaderboard', 'top_boxad'],
			slotsToDisable: [],
		});
		templateService.register(FloatingRail, {
			enabled: false,
		});
	}
}
