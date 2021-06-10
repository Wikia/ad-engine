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
	SlotSizeImpactToResolvedHandler,
	SlotSizeResolvedHandler,
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
				SlotPositionEmbeddedBig,
				SlotDecisionEmbeddedBigToStickyBigHandler,
				SlotSizeImpactToResolvedHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyBig: [
				SlotPositionStickyBigHandler,
				SlotDecisionStickyBigToEmbeddedBigHandler,
				SlotSizeResolvedHandler,
				DomCleanupHandler,
			],
			transition: [],
			embeddedSmall: [
				SlotPositionEmbeddedSmallHandler,
				SlotDecisionEmbeddedSmallToStickySmallHandler,
				SlotSizeResolvedHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickySmall: [
				SlotPositionStickySmallHandler,
				SlotSizeResolvedHandler,
				SlotDecisionStickySmallToEmbeddedSmallHandler,
				DomCleanupHandler,
			],
			embeddedResolved: [
				SlotPositionEmbeddedResolvedHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
				SlotSizeResolvedHandler,
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
