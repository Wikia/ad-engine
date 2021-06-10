import {
	AdvertisementLabelHandler,
	BfaaNewBootstrapHandler,
	CloseButtonHelper,
	CloseToEmbeddedResolvedButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionEmbeddedBigToEmbeddedResolvedHandler,
	SlotDecisionEmbeddedBigToStickyBigHandler,
	SlotDecisionEmbeddedSmallToStickySmallHandler,
	SlotDecisionStickyBigToEmbeddedBigHandler,
	SlotDecisionStickySmallToEmbeddedSmallHandler,
	SlotPositionEmbeddedBig,
	SlotPositionEmbeddedSmallHandler,
	SlotPositionStickyBigHandler,
	SlotPositionStickySmallHandler,
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
				SlotPositionEmbeddedBig,
				SlotDecisionEmbeddedBigToEmbeddedResolvedHandler,
				SlotDecisionEmbeddedBigToStickyBigHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyBig: [
				CloseToEmbeddedResolvedButtonHandler,
				SlotPositionStickyBigHandler,
				SlotDecisionStickyBigToEmbeddedBigHandler,
				DomCleanupHandler,
			],
			transition: [],
			embeddedSmall: [
				SlotPositionEmbeddedSmallHandler,
				SlotDecisionEmbeddedSmallToStickySmallHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickySmall: [
				SlotPositionStickySmallHandler,
				SlotDecisionStickySmallToEmbeddedSmallHandler,
				DomCleanupHandler,
			],
			embeddedResolved: [],
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
