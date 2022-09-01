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
	VideoRestartHandler,
	VideoSizeImpactToResolvedHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUcpDesktopUapDomElements } from './configs/register-ucp-desktop-uap-dom-elements';
import { BfaaUcpDesktopConfigHandler } from './handlers/bfaa/bfaa-ucp-desktop-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaUcpDesktopConfigHandler,
				BfaaBootstrapHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [
				SlotSizeImpactWithPlaceholderHandler,
				SlotDecisionImpactToResolvedHandler,
				SlotHeightClippingHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
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
			registerUcpDesktopUapDomElements(),
		],
	);
}
