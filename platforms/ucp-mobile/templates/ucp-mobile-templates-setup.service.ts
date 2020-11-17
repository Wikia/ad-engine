import { registerFloorAdhesionTemplate, registerInterstitialTemplate } from '@platforms/shared';
import {
	AffiliateDisclaimer,
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
import { registerLogoReplacementTemplate } from './logo-replacement-template';
import { registerRoadblockTemplate } from './roadblock-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpMobileTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);
		const bfaa$ = registerBfaaTemplate(this.registry);
		const bfab$ = registerBfabTemplate(this.registry);
		const logoReplacement$ = registerLogoReplacementTemplate(this.registry);
		const roadblock$ = registerRoadblockTemplate(this.registry);
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);

		logTemplates(
			merge(bfaa$, bfab$, stickyTlb$, logoReplacement$, roadblock$, floorAdhesion$, interstitial$),
		);

		templateService.register(AffiliateDisclaimer);
		templateService.register(PorvataTemplate, getOutstreamConfig());
	}
}
