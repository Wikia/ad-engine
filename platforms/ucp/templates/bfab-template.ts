import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { BfabBootstrapHandler } from './handlers/bfab-bootstrap-handler';
import { BfabImpactHandler } from './handlers/bfab-impact-handler';
import { BfabResolvedHandler } from './handlers/bfab-resolved-handler';

export function registerBfabTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfab',
		{
			initial: [BfabBootstrapHandler],
			impact: [BfabImpactHandler],
			resolved: [BfabResolvedHandler],
		},
		'initial',
	);
}
