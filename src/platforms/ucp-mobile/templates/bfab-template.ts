import { TemplateAction, TemplateRegistry } from '@ad-engine/core';
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
	VideoLearnMoreHandler,
	VideoSizeImpactHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { Observable } from 'rxjs';
import { registerUcpMobileUapDomElements } from './configs/register-ucp-mobile-uap-dom-elements';

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
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			resolved: [SlotSizeResolvedHandler, VideoSizeResolvedHandler, DomCleanupHandler],
		},
		'initial',
		[
			PlayerRegistry,
			DomManipulator,
			UapDomManager,
			UapDomReader,
			VideoDomReader,
			VideoDomManager,
			registerUcpMobileUapDomElements(),
		],
	);
}
