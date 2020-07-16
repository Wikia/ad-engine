import {
	AdvertisementLabelHandler,
	BfabBootstrapHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	SlotSizeImpactHandler,
	SlotSizeResolvedHandler,
	UapDomManager,
	UapDomReader,
	VideoBootstrapHandler,
	VideoCompletedHandler,
	VideoDomManager,
	VideoDomReader,
	VideoSizeImpactHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';

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
				SlotSizeImpactHandler,
				VideoSizeImpactHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			resolved: [SlotSizeResolvedHandler, VideoSizeResolvedHandler, DomCleanupHandler],
		},
		'initial',
		[PlayerRegistry, DomManipulator, UapDomManager, UapDomReader, VideoDomReader, VideoDomManager],
	);
}
