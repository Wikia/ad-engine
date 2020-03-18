import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfabBootstrapHandler } from './handlers/bfab/bfab-bootstrap-handler';
import { BfabImpactHandler } from './handlers/bfab/bfab-impact-handler';
import { BfabResolvedHandler } from './handlers/bfab/bfab-resolved-handler';
import { BfabVideoImpactHandler } from './handlers/bfab/bfab-video-impact-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { VideoBootstrapHandler } from './handlers/video-bootstrap-handler';
import { VideoCompletedHandler } from './handlers/video-completed-handler';
import { VideoResolvedHandler } from './handlers/video-resolved-handler';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';
import { PlayerRegistry } from './helpers/player-registry';

export function registerBfabTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfab',
		{
			initial: [
				BfabBootstrapHandler,
				VideoBootstrapHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [BfabImpactHandler, BfabVideoImpactHandler, VideoCompletedHandler],
			resolved: [BfabResolvedHandler, VideoResolvedHandler],
		},
		'initial',
		[PlayerRegistry, DomManipulator],
	);
}
