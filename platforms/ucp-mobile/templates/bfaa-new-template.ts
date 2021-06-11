import {
	AdvertisementLabelHandler,
	BfaaNewBootstrapHandler,
	CloseButtonHelper,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionEmbeddedBigToStickyBigHandler,
	SlotDecisionEmbeddedSmallToStickySmallHandler,
	SlotDecisionStickyBigToEmbeddedBigHandler,
	SlotDecisionStickySmallToEmbeddedSmallHandler,
	SlotPositionEmbeddedBig,
	SlotPositionEmbeddedResolvedHandler,
	SlotPositionEmbeddedSmallHandler,
	SlotPositionStickyBigHandler,
	SlotPositionStickySmallHandler,
	SlotSizeResolvedHandler,
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
			embeddedBig: [
				SlotSizeResolvedHandler,
				SlotPositionEmbeddedBig,
				SlotDecisionEmbeddedBigToStickyBigHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyBig: [
				SlotSizeResolvedHandler,
				SlotPositionStickyBigHandler,
				SlotDecisionStickyBigToEmbeddedBigHandler,
				DomCleanupHandler,
			],
			transition: [],
			embeddedSmall: [
				SlotSizeResolvedHandler,
				SlotPositionEmbeddedSmallHandler,
				SlotDecisionEmbeddedSmallToStickySmallHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickySmall: [
				SlotSizeResolvedHandler,
				SlotPositionStickySmallHandler,
				SlotDecisionStickySmallToEmbeddedSmallHandler,
				DomCleanupHandler,
			],
			embeddedResolved: [
				SlotPositionEmbeddedResolvedHandler,
				VideoSizeResolvedHandler,
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
