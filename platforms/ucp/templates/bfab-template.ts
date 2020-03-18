import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfabBootstrapHandler } from './handlers/bfab/bfab-bootstrap-handler';
import { BfabImpactHandler } from './handlers/bfab/bfab-impact-handler';
import { BfabImpactVideoHandler } from './handlers/bfab/bfab-impact-video-handler';
import { BfabResolvedHandler } from './handlers/bfab/bfab-resolved-handler';
import { BootstrapVideoHandler } from './handlers/bootstrap-video-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { ResolvedVideoHandler } from './handlers/resolved-video-handler';
import { PlayerRegistry } from './helpers/player-registry';

export function registerBfabTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfab',
		{
			initial: [
				BfabBootstrapHandler,
				BootstrapVideoHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [BfabImpactHandler, BfabImpactVideoHandler],
			resolved: [BfabResolvedHandler, ResolvedVideoHandler],
		},
		'initial',
		[PlayerRegistry],
	);
}
