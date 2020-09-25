import { registerFloorAdhesionTemplate, registerInterstitialTemplate } from '@platforms/shared';
import {
	DiProcess,
	logTemplates,
	PorvataTemplate,
	TemplateRegistry,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { getOutstreamConfig } from './configs/outstream-config';

@Injectable()
export class UcpMercuryTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		const floorAdhesion$ = registerFloorAdhesionTemplate(this.registry);
		const interstitial$ = registerInterstitialTemplate(this.registry);

		logTemplates(merge(floorAdhesion$, interstitial$));

		templateService.register(PorvataTemplate, getOutstreamConfig());
	}
}
