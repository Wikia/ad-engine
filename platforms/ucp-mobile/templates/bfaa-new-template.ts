import {
	AdvertisementLabelHandler,
	BfaaNewBootstrapHandler,
	CloseButtonHelper,
	CloseToTransitionButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionEmbeddedBigToEmbeddedResolvedHandler,
	SlotDecisionEmbeddedBigToStickyBigHandler,
	SlotDecisionEmbeddedSmallToEmbeddedResolvedHandler,
	SlotDecisionEmbeddedSmallToStickySmallHandler,
	SlotDecisionStickyBigToEmbeddedBigHandler,
	SlotDecisionStickySmallToEmbeddedSmallHandler,
	SlotDecisionTimeoutWithoutScrollHandler,
	SlotPositionEmbeddedBig,
	SlotPositionEmbeddedResolvedHandler,
	SlotPositionEmbeddedSmallHandler,
	SlotPositionStickyBigHandler,
	SlotPositionStickySmallHandler,
	SlotSizeImpactHandler,
	SlotSizeResolvedHandler,
	SlotTransitionNewTemplateHandler,
	StickinessTimeout,
	UapDomManager,
	UapDomReader,
	VideoBootstrapHandler,
	VideoDomManager,
	VideoDomReader,
	VideoLearnMoreHandler,
	VideoNewBfaaRestartHandler,
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
				VideoNewBfaaRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			embeddedBig: [
				SlotSizeImpactHandler,
				SlotPositionEmbeddedBig,
				SlotDecisionEmbeddedBigToEmbeddedResolvedHandler,
				SlotDecisionEmbeddedBigToStickyBigHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyBig: [
				SlotSizeImpactHandler,
				SlotPositionStickyBigHandler,
				SlotDecisionStickyBigToEmbeddedBigHandler,
				CloseToTransitionButtonHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedHandler,
				SlotTransitionNewTemplateHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			embeddedSmall: [
				SlotSizeResolvedHandler,
				SlotPositionEmbeddedSmallHandler,
				SlotDecisionEmbeddedSmallToStickySmallHandler,
				SlotDecisionEmbeddedSmallToEmbeddedResolvedHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickySmall: [
				SlotSizeResolvedHandler,
				SlotPositionStickySmallHandler,
				SlotDecisionTimeoutWithoutScrollHandler,
				SlotDecisionStickySmallToEmbeddedSmallHandler,
				CloseToTransitionButtonHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			embeddedResolved: [
				SlotSizeResolvedHandler,
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
