import {
	AdvertisementLabelHandler,
	BfaaBootstrapLightHandler,
	CloseButtonHelper,
	CloseToTransitionButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	NavbarOffsetResolvedHandler,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionImpactToResolvedHandler,
	SlotDecisionTimeoutHandler,
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
				BfaaBootstrapLightHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [
				SlotSizeImpactWithPlaceholderHandler,
				SlotDecisionImpactToResolvedHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				NavbarOffsetResolvedHandler,
				SlotSizeResolvedWithPlaceholderHandler,
				SlotDecisionTimeoutHandler,
				SlotStateStickedHandler,
				CloseToTransitionButtonHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			transition: [
				NavbarOffsetResolvedHandler,
				SlotSizeResolvedWithPlaceholderHandler,
				SlotStateStickedHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedWithPlaceholderHandler,
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
