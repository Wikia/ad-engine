import { TemplateAction, TemplateRegistry } from '@ad-engine/core';
import {
	AdvertisementLabelHandler,
	BfaaBootstrapHandler,
	CloseButtonHelper,
	CloseToTransitionButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionImpactToResolvedHandler,
	SlotDecisionTimeoutHandler,
	SlotHeightClippingHandler,
	SlotSizeImpactToResolvedHandler,
	SlotSizeImpactWithPlaceholderHandler,
	SlotSizeResolvedWithPlaceholderHandler,
	SlotStateStickedHandler,
	SlotTransitionHandler,
	StickinessTimeout,
	UapDomManager,
	UapDomReader,
	VideoBootstrapHandler,
	VideoCompletedHandler,
	VideoCtpHandler,
	VideoDomManager,
	VideoDomReader,
	VideoLearnMoreHandler,
	VideoRestartHandler,
	VideoSizeImpactToResolvedHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { universalAdPackage } from '@wikia/ad-products';
import { Observable } from 'rxjs';
import { registerUcpMobileUapDomElements } from './configs/register-ucp-mobile-uap-dom-elements';
import { BfaaUcpMobileConfigHandler } from './handlers/bfaa/bfaa-ucp-mobile-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaUcpMobileConfigHandler,
				BfaaBootstrapHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [
				SlotSizeImpactWithPlaceholderHandler,
				SlotSizeImpactToResolvedHandler,
				SlotDecisionImpactToResolvedHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
				VideoLearnMoreHandler,
				DomCleanupHandler,
			],
			sticky: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotDecisionTimeoutHandler,
				SlotStateStickedHandler,
				CloseToTransitionButtonHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotStateStickedHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotHeightClippingHandler,
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
