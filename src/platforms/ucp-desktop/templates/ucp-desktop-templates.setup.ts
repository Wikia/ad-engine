import { registerInterstitialTemplate, StickedBoxadHelper } from '@platforms/shared';
import {
	DiProcess,
	logTemplates,
	PorvataTemplate,
	TemplateRegistry,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { getOutstreamConfig } from './configs/outstream-config';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpDesktopTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry, private stickedBoxadHelper: StickedBoxadHelper) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);

		logTemplates(merge(bfaa$, bfab$, stickyTlb$, roadblock$, floorAdhesion$, interstitial$));

		templateService.register(PorvataTemplate, getOutstreamConfig());

		this.stickedBoxadHelper.initialize({
			slotName: 'top_boxad',
			pusherSlotName: 'top_leaderboard',
			pageSelector: '.page',
			railSelector: '.main-page-tag-rcs #top_boxad, #rail-boxad-wrapper',
		});
	}
}
