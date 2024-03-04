import { registerInterstitialTemplate } from '@platforms/shared';
import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { registerFloorAdhesionTemplate } from './floor-adhesion-template';
import { registerStickyTlbTemplate } from './sticky-tlb-template';

@Injectable()
export class UcpMobileTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const stickyTlb$ = registerStickyTlbTemplate(this.registry);
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);

		logTemplates(merge(stickyTlb$, floorAdhesion$, interstitial$));
	}
}
