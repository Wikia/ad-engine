import { registerInterstitialTemplate } from '@platforms/shared';
import {
	AffiliateDisclaimer,
	context,
	DiProcess,
	logTemplates,
	PorvataTemplate,
	TemplateRegistry,
	templateService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerBfaa3Template } from './bfaa-3-template';
import { registerBfaaOldTemplate } from './bfaa-old-template';
import { registerBfaaTemplate } from './bfaa-template';
import { registerBfabTemplate } from './bfab-template';
import { getOutstreamConfig } from './configs/outstream-config';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
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
		const bfaa$ = context.get('options.newBfaaTemplate')
			? utils.queryString.get('use-uap-3')
				? registerBfaa3Template(this.registry)
				: registerBfaaTemplate(this.registry)
			: registerBfaaOldTemplate(this.registry);
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
