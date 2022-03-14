import { registerInterstitialTemplate } from '@platforms/shared';
import {
	context,
	DiProcess,
	logTemplates,
	PorvataTemplate,
	SafeFanTakeoverElement,
	TemplateRegistry,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaaOldTemplate } from './bfaa-old-template';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { getOutstreamConfig } from './configs/outstream-config';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerLogoReplacementTemplate } from './logo-replacement-template';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpDesktopTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const bfaa$ = context.get('options.newBfaaTemplate')
			? registerBfaaTemplate(this.registry)
			: registerBfaaOldTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);
		const logoReplacement$ = registerLogoReplacementTemplate(this.registry);

		logTemplates(
			merge(bfaa$, bfab$, stickyTlb$, roadblock$, floorAdhesion$, interstitial$, logoReplacement$),
		);

		templateService.register(PorvataTemplate, getOutstreamConfig());
		templateService.register(SafeFanTakeoverElement);
	}
}
