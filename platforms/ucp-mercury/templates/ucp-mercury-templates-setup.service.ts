import { DiProcess, PorvataTemplate, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getOutstreamConfig } from './configs/outstream-config';

@Injectable()
export class UcpMercuryTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry) {
		templateService.setInitializer(this.registry);
	}

	execute(): void {
		templateService.register(PorvataTemplate, getOutstreamConfig());
	}
}
