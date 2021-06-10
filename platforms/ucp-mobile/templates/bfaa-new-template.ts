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
	SlotDecisionEmbeddedBigToStickyBigHandler,
	SlotDecisionEmbeddedSmallToStickySmallHandler,
	SlotDecisionStickyBigToEmbeddedBigHandler,
	SlotDecisionStickySmallToEmbeddedSmallHandler,
	SlotPositionEmbeddedBig,
	SlotPositionEmbeddedSmallHandler,
	SlotPositionStickyBigHandler,
	SlotPositionStickySmallHandler,
	SlotSizeResolvedHandler,
	SlotTransitionHandler,
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
import { SlotDecisionStickySmallToTransitionHandler } from '../../shared/templates/handlers/slot/slot-decision-sticky-small-to-transition-handler';
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
				SlotDecisionEmbeddedBigToStickyBigHandler,
				VideoSizeImpactHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			stickyBig: [
				SlotPositionStickyBigHandler,
				SlotDecisionStickyBigToEmbeddedBigHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			embeddedSmall: [
				SlotPositionEmbeddedSmallHandler,
				SlotDecisionEmbeddedSmallToStickySmallHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			stickySmall: [
				SlotPositionStickySmallHandler,
				CloseToTransitionButtonHandler,
				SlotDecisionStickySmallToTransitionHandler,
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
