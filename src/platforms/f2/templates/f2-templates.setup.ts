// @ts-strict-ignore
import { StickedBoxadHelper } from '@platforms/shared';
import {
	context,
	DiProcess,
	logTemplates,
	TemplateRegistry,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class F2TemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry, private stickedBoxadHelper: StickedBoxadHelper) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);

		logTemplates(merge(bfaa$, bfab$, stickyTlb$, roadblock$, floorAdhesion$));

		if (!context.get('state.isMobile')) {
			this.stickedBoxadHelper.initialize({
				slotName: 'top_boxad',
				pusherSlotName: 'top_leaderboard',
				pageSelector: '.article-layout-wrapper, .feed-layout',
				railSelector: '.feed-layout__right-rail, .article-layout__top-box-ad',
			});
		}
	}
}
