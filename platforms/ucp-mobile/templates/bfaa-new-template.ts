import {
	BfaaNewBootstrapHandler,
	CloseButtonHelper,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionEmbeddedImpactToStickyImpactHandler,
	SlotDecisionEmbeddedResolvedToStickyResolvedHandler,
	SlotPositionEmbeddedToSticky,
	SlotSizeImpactToResolvedHandler,
	SlotSizeResolvedHandler,
	StickinessTimeout,
	UapDomManager,
	UapDomReader,
	VideoBootstrapHandler,
	VideoDomManager,
	VideoDomReader,
	VideoLearnMoreHandler,
	VideoSizeImpactToResolvedHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUcpMobileUapDomElements } from './configs/register-ucp-mobile-uap-dom-elements';
import { BfaaUcpMobileConfigHandler } from './handlers/bfaa/bfaa-ucp-mobile-config-handler';

export function registerBfaaNewTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaUcpMobileConfigHandler,
				BfaaNewBootstrapHandler,
				VideoBootstrapHandler,
				DebugTransitionHandler,
			],
			embeddedImpact: [
				SlotSizeImpactToResolvedHandler,
				SlotDecisionEmbeddedImpactToStickyImpactHandler,
				VideoSizeImpactToResolvedHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyImpact: [SlotPositionEmbeddedToSticky, DomCleanupHandler],
			transition: [],
			embeddedResolved: [
				SlotSizeResolvedHandler,
				SlotDecisionEmbeddedResolvedToStickyResolvedHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickyResolved: [SlotPositionEmbeddedToSticky, DomCleanupHandler],
		},
		'initial',
		[
			ScrollCorrector,
			PlayerRegistry,
			DomManipulator,
			UapDomManager,
			UapDomReader,
			VideoDomReader,
			VideoDomManager,
			CloseButtonHelper,
			StickinessTimeout.provide(universalAdPackage.BFAA_UNSTICK_DELAY),
			registerUcpMobileUapDomElements(),
		],
	);
}
