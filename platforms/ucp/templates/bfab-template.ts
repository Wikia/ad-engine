import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfabBootstrapHandler } from './handlers/bfab/bfab-bootstrap-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { SlotSizeBigHandler } from './handlers/slot/slot-size-big-handler';
import { SlotSizeSmallHandler } from './handlers/slot/slot-size-small-handler';
import { VideoBootstrapHandler } from './handlers/video/video-bootstrap-handler';
import { VideoCompletedHandler } from './handlers/video/video-completed-handler';
import { VideoSizeImpactHandler } from './handlers/video/video-size-impact-handler';
import { VideoSizeResolvedHandler } from './handlers/video/video-size-resolved-handler';
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
			impact: [
				SlotSizeBigHandler,
				VideoSizeImpactHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			resolved: [SlotSizeSmallHandler, VideoSizeResolvedHandler, DomCleanupHandler],
		},
		'initial',
		[PlayerRegistry, DomManipulator, UapDomManager, UapDomReader, VideoDomManager],
	);
}
