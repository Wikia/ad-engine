import {
	AdvertisementLabelHandler,
	BfaaNewBootstrapHandler,
	CloseButtonHelper,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionEmbeddedImpactToStickyImpactHandler,
	SlotDecisionEmbeddedResolvedToStickyResolvedHandler,
	SlotDecisionStickyImpactToEmbeddedImpactHandler,
	SlotDecisionStickyResolvedToEmbeddedResolvedHandler,
	SlotPositionEmbeddedImpactToStickyImpactHandler,
	SlotPositionEmbeddedResolvedToStickyResolvedHandler,
	StickinessTimeout,
	UapDomManager,
	UapDomReader,
	VideoBootstrapHandler,
	VideoDomManager,
	VideoDomReader,
	VideoLearnMoreHandler,
	VideoSizeImpactHandler,
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
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			embeddedImpact: [
				SlotDecisionEmbeddedImpactToStickyImpactHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyImpact: [
				SlotPositionEmbeddedImpactToStickyImpactHandler,
				SlotDecisionStickyImpactToEmbeddedImpactHandler,
				DomCleanupHandler,
			],
			transition: [],
			embeddedResolved: [
				SlotDecisionEmbeddedResolvedToStickyResolvedHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickyResolved: [
				SlotPositionEmbeddedResolvedToStickyResolvedHandler,
				SlotDecisionStickyResolvedToEmbeddedResolvedHandler,
				DomCleanupHandler,
			],
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
