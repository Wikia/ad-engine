import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfabBootstrapHandler } from './handlers/bfab-bootstrap-handler';
import { BfabImpactHandler } from './handlers/bfab-impact-handler';
import { BfabImpactVideoHandler } from './handlers/bfab-impact-video-handler';
import { BfabResolvedHandler } from './handlers/bfab-resolved-handler';
import { BfabResolvedVideoHandler } from './handlers/bfab-resolved-video-handler';
import { BfabVideoHandler } from './handlers/bfab-video-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';

export function registerBfabTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfab',
		{
			initial: [
				BfabBootstrapHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
				BfabVideoHandler,
			],
			impact: [BfabImpactHandler, BfabImpactVideoHandler],
			resolved: [BfabResolvedHandler, BfabResolvedVideoHandler],
		},
		'initial',
	);
}
