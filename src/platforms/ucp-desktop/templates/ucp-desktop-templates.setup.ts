// @ts-strict-ignore
import { registerInterstitialTemplate, StickedBoxadHelper } from '@platforms/shared';
import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpDesktopTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry, private stickedBoxadHelper: StickedBoxadHelper) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);

		logTemplates(merge(stickyTlb$, roadblock$, floorAdhesion$, interstitial$));

		this.stickedBoxadHelper.initialize({
			slotName: 'top_boxad',
			pusherSlotName: 'top_leaderboard',
			pageSelector: '.page',
			railSelector: '.main-page-tag-rcs #top_boxad, #rail-boxad-wrapper',
		});
	}
}
