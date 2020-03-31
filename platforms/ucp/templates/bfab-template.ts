import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfabBootstrapHandler } from './handlers/bfab/bfab-bootstrap-handler';
import { BfabImpactHandler } from './handlers/bfab/bfab-impact-handler';
import { BfabVideoImpactHandler } from './handlers/bfab/bfab-video-impact-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { ResolvedHandler } from './handlers/resolved-handler';
import { VideoBootstrapHandler } from './handlers/video-bootstrap-handler';
import { VideoCompletedHandler } from './handlers/video-completed-handler';
import { VideoResolvedHandler } from './handlers/video-resolved-handler';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';
import { PlayerRegistry } from './helpers/player-registry';
import { UapDomManager } from './helpers/uap-dom-manager';
import { UapDomReader } from './helpers/uap-dom-reader';
import { VideoDomManager } from './helpers/video-dom-manager';

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
			impact: [BfabImpactHandler, BfabVideoImpactHandler, VideoCompletedHandler, DomCleanupHandler],
			resolved: [ResolvedHandler, VideoResolvedHandler, DomCleanupHandler],
		},
		'initial',
		[PlayerRegistry, DomManipulator, UapDomManager, UapDomReader, VideoDomManager],
	);
}
